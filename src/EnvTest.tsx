// src/components/EnvTest.tsx or .jsx
export default function EnvTest() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Env Variable Test</h1>
      <p>{import.meta.env.VITE_PAYSTACK_PUBLIC_KEY}</p>
    </div>
  );
}
