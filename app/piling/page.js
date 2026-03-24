import PilingForm from "@/components/piling/PilingForm";

export default function PilingPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Piling Tool</h1>
        <PilingForm />
      </div>
    </div>
  );
}