"use client";

import { useEffect, useState } from "react";
import API_ROUTES from "../app/services/api";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../app/layout";
import Navbar from "@/components/ui/navbar";

interface Tipo {
  id: number;
  nombre: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  descripcion: string;
}

export default function Tipos() {
  const [tipos, setTipos] = useState<Tipo[]>([]);
  const [nuevoTipo, setNuevoTipo] = useState({
    nombre: "",
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    descripcion: "",
  });

  const [editandoTipo, setEditandoTipo] = useState<Tipo | null>(null);

  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await fetch(API_ROUTES.TIPOS);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setTipos(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchTipos();
  }, []);

  const crearTipo = async () => {
    try {
      const response = await fetch(API_ROUTES.TIPOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoTipo),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTipos([...tipos, data]);
      setNuevoTipo({
        nombre: "",
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        descripcion: "",
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const editarTipo = async (tipo: Tipo) => {
    try {
      const response = await fetch(`${API_ROUTES.TIPOS}/${tipo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tipo),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setTipos(tipos.map((p) => (p.id === tipo.id ? data : p)));
      setEditandoTipo(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const eliminarTipo = async (id: number) => {
    try {
      const response = await fetch(`${API_ROUTES.TIPOS}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setTipos(tipos.filter((tipo) => tipo.id !== id));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  return (
    <Layout>
      <Navbar />
      <div className="mb-4 p-4 bg-white shadow rounded">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={nuevoTipo.nombre}
              onChange={(e) =>
                setNuevoTipo({
                  ...nuevoTipo,
                  nombre: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoTipo.descripcion}
              onChange={(e) =>
                setNuevoTipo({
                  ...nuevoTipo,
                  descripcion: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <button
              onClick={crearTipo}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear
            </button>
          </div>
        </div>
      </div>
      {tipos.map((tipo) => (
        <div key={tipo.id} className="mb-4 p-4 bg-white shadow rounded">
          {editandoTipo?.id === tipo.id ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editandoTipo.nombre}
                  onChange={(e) =>
                    setEditandoTipo({
                      ...editandoTipo,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Descripción"
                  value={editandoTipo.descripcion}
                  onChange={(e) =>
                    setEditandoTipo({
                      ...editandoTipo,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarTipo(editandoTipo)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoTipo(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p>{tipo.nombre}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p>{tipo.descripcion}</p>
              </div>
              <div className="flex space-x-2">
                <IconButton
                  color="primary"
                  onClick={() => setEditandoTipo(tipo)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => eliminarTipo(tipo.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            </div>
          )}
        </div>
      ))}
    </Layout>
  );
}
