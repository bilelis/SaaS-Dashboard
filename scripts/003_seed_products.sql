-- Seed sample products
insert into public.products (id, name, description, price, features)
values
  (
    gen_random_uuid(),
    'Starter',
    'Perfect for getting started',
    29,
    '["5 Projects", "Basic Analytics", "Email Support"]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Professional',
    'For growing teams',
    79,
    '["Unlimited Projects", "Advanced Analytics", "Priority Support", "Team Collaboration"]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Enterprise',
    'For large organizations',
    249,
    '["Everything in Professional", "Custom Integration", "Dedicated Support", "SLA Guarantee"]'::jsonb
  )
on conflict do nothing;
