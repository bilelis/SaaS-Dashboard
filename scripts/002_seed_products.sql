-- Seed sample products
INSERT INTO products (name, description, price, features, active) VALUES
(
  'Starter',
  'Perfect for getting started',
  29,
  '["Up to 10 projects", "5GB storage", "Basic support", "Community access"]',
  true
),
(
  'Professional',
  'For growing teams',
  99,
  '["Unlimited projects", "100GB storage", "Priority support", "Advanced analytics", "Team collaboration"]',
  true
),
(
  'Enterprise',
  'For large organizations',
  299,
  '["Unlimited everything", "1TB storage", "24/7 dedicated support", "Custom integrations", "Admin controls"]',
  true
);
