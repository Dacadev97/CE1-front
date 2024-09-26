"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dna,
  BookUser,
  Clapperboard,
  BookType,
  MonitorPlay,
} from "lucide-react";

export function DashboardComponent() {
  const menuItems = [
    { icon: Dna, label: "Género", href: "/generos" },
    { icon: BookUser, label: "Directores", href: "/directores" },
    { icon: Clapperboard, label: "Productoras", href: "/productoras" },
    { icon: BookType, label: "Tipos", href: "/tipos" },
    { icon: MonitorPlay, label: "Medias", href: "/medias" },
  ];

  return (
    <html>
      <body>
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-8">
            PANEL DE INICIO
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item, index) => (
              <Link
                href={item.href}
                key={index}
                className="transform transition-all hover:scale-105"
              >
                <Card className="h-full bg-white hover:bg-gray-50 cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <item.icon className="w-12 h-12 text-indigo-500 mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700">
                      {item.label}
                    </h2>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </body>
    </html>
  );
}

export default DashboardComponent;
