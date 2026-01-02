-- Insert sample products for testing
INSERT INTO products (name, description, price, features) VALUES
(
  'Starter',
  'Perfect for getting started',
  29.00,
  '["Up to 10 projects", "Basic analytics", "Community support"]'::jsonb
),
(
  'Professional',
  'For growing teams',
  79.00,
  '["Up to 100 projects", "Advanced analytics", "Priority support", "API access"]'::jsonb
),
(
  'Enterprise',
  'For large organizations',
  299.00,
  '["Unlimited projects", "Real-time analytics", "24/7 support", "Custom integrations", "SLA guarantee"]'::jsonb
);
