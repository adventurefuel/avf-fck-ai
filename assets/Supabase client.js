// 4DRIP — shared Supabase client + WhatsApp helpers.
// Loaded after the supabase-js CDN script on every page.

const SUPABASE_URL = "https://huoortkwcgaqztgndxns.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1b29ydGt3Y2dhcXp0Z25keG5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5MzAyNjEsImV4cCI6MjEwMzUwNjI2MX0.5wqyJyM3C8485CTtYL6NhFH1OOnvzgIaOjojjDCNuHo";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const WA_NUMBER = "15865535504"; // +1 586 553 5504
const WA_DISPLAY = "(586) 553-5504";

function waLink(text) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text || "")}`;
}

function waProductLink(p, extra) {
  let msg = `Hey 4DRIP, I'm interested in ${p.brand} ${p.name} (SKU ${p.sku}).`;
  if (extra) msg += `\n\n${extra}`;
  return waLink(msg);
}

function productImageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path) || /^data:/.test(path)) return path;
  const { data } = db.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}

// ---------- Analytics tracking ----------
// Lightweight, best-effort site-visit + click-through logging. Never throws,
// never blocks the page — if it fails, the visitor never notices.
function getAnalyticsSessionId() {
  try {
    let sid = sessionStorage.getItem("4drip_sid");
    if (!sid) {
      sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem("4drip_sid", sid);
    }
    return sid;
  } catch (e) {
    return "no-session";
  }
}

function trackEvent(eventType, opts) {
  opts = opts || {};
  try {
    db.from("analytics_events").insert({
      event_type: eventType,
      page: opts.page || (document.body && document.body.dataset.page) || location.pathname,
      label: opts.label || null,
      sku: opts.sku || null,
      path: location.pathname,
      referrer: document.referrer || null,
      session_id: getAnalyticsSessionId(),
    }).then(function(){}, function(){});
  } catch (e) {
    // tracking must never break the page
  }
}

function trackPageview(page) {
  trackEvent("pageview", { page: page });
}

function trackClick(label, extra) {
  trackEvent("click", Object.assign({ label: label }, extra || {}));
}
