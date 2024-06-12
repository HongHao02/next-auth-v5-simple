import Image from "next/image";
import Dashboard from "../components/ui/Dashboard";

export default function Home() {
  return (
    <main>
      <div className="flex justify-center items-center h-screen">
        <Dashboard></Dashboard>
      </div>
    </main>
  );
}
