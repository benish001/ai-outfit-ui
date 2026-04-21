/**
 * useBeautyOrders — manages beauty shop orders.
 *
 * Orders are persisted in localStorage immediately (optimistic UI), then
 * synced to the backend for vCommission commission attribution.
 *
 * An "order" in this context = affiliate-click intent to purchase.
 * "Cancel" = user removes the order before actually completing purchase.
 */
import { useState, useEffect, useCallback } from 'react';

const LS_KEY      = 'beauty_orders_v1';
const SESSION_KEY = 'beauty_session_id_v1';
const API_BASE    = import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1';

// Generate or retrieve a stable browser session ID
function getSessionId() {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `bs_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveToStorage(orders) {
  localStorage.setItem(LS_KEY, JSON.stringify(orders));
}

export function useBeautyOrders() {
  const [orders, setOrders]     = useState(loadFromStorage);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const sessionId               = getSessionId();

  // Persist on every change
  useEffect(() => {
    saveToStorage(orders);
  }, [orders]);

  /**
   * placeOrder — called when user taps "Order Now".
   * Opens the affiliate link in a new tab AND records the order.
   */
  const placeOrder = useCallback(async (product) => {
    // 1. Build local order object (optimistic)
    const localOrder = {
      local_id:      `lo_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      session_id:    sessionId,
      product_id:    product.id,
      product_name:  product.name,
      brand:         product.brand,
      category:      product.category,
      price:         product.price,
      image_url:     product.image_url,
      affiliate_link:product.affiliate_link,
      skin_tone:     product.skin_tone || null,
      status:        'placed',
      platform:      'amazon',
      created_at:    new Date().toISOString(),
      updated_at:    new Date().toISOString(),
      backend_id:    null,  // filled after backend sync
    };

    // 2. Add to local state immediately
    setOrders(prev => [localOrder, ...prev]);

    // 3. Open affiliate link in new tab
    if (product.affiliate_link && product.affiliate_link !== '#') {
      window.open(product.affiliate_link, '_blank', 'noopener,noreferrer');
    }

    // 4. Sync to backend (non-blocking)
    try {
      const res = await fetch(`${API_BASE}/beauty/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id:    sessionId,
          product_id:    product.id,
          product_name:  product.name,
          brand:         product.brand,
          category:      product.category,
          price:         product.price,
          image_url:     product.image_url,
          affiliate_link:product.affiliate_link,
          skin_tone:     product.skin_tone || null,
          platform:      'amazon',
        }),
      });
      if (res.ok) {
        const data = await res.json();
        // Store backend ID for cancel
        setOrders(prev =>
          prev.map(o =>
            o.local_id === localOrder.local_id ? { ...o, backend_id: data.id } : o
          )
        );
      }
    } catch (err) {
      console.warn('Beauty order backend sync failed (local state is fine):', err);
    }

    return localOrder;
  }, [sessionId]);

  /**
   * cancelOrder — marks a placed order as cancelled.
   */
  const cancelOrder = useCallback(async (localId) => {
    const order = orders.find(o => o.local_id === localId);
    if (!order) return;

    // Optimistic update
    setOrders(prev =>
      prev.map(o =>
        o.local_id === localId
          ? { ...o, status: 'cancelled', updated_at: new Date().toISOString() }
          : o
      )
    );

    // Sync cancellation to backend
    if (order.backend_id) {
      try {
        await fetch(
          `${API_BASE}/beauty/orders/${order.backend_id}/cancel?session_id=${sessionId}`,
          { method: 'PUT' }
        );
      } catch (err) {
        console.warn('Cancel sync failed (local state updated):', err);
      }
    }
  }, [orders, sessionId]);

  /**
   * removeOrder — wipes order completely from local list.
   */
  const removeOrder = useCallback((localId) => {
    setOrders(prev => prev.filter(o => o.local_id !== localId));
  }, []);

  const placedOrders    = orders.filter(o => o.status === 'placed');
  const cancelledOrders = orders.filter(o => o.status === 'cancelled');

  return {
    orders,
    placedOrders,
    cancelledOrders,
    loading,
    error,
    sessionId,
    placeOrder,
    cancelOrder,
    removeOrder,
  };
}
