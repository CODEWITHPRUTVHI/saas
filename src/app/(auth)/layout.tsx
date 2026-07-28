export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #3D52A0 0%, #5a6fc0 40%, #7091E6 100%)" }}>
      {children}
    </div>
  );
}
