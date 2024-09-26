"use client";

import { useEffect, useState } from "react";
import API_ROUTES from "../app/services/api";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../app/layout";
import Navbar from "@/components/ui/navbar";

interface Genero {
  id: number;
  nombre: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  descripcion: string;
}

export default function Generos() {
  const [generos, setGeneros] = useState<Genero[]>([]);
  const [nuevoGenero, setNuevoGenero] = useState({
    nombre: "",
    estado: true,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    descripcion: "",
  });
  const [editandoGenero, setEditandoGenero] = useState<Genero | null>(null);

  useEffect(() => {
    const fetchGeneros = async () => {
      try {
        const response = await fetch(API_ROUTES.GENEROS);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGeneros(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchGeneros();
  }, []);

  const crearGenero = async () => {
    try {
      const response = await fetch(API_ROUTES.GENEROS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoGenero),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setGeneros([...generos, data]);
      setNuevoGenero({
        nombre: "",
        estado: true,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        descripcion: "",
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const editarGenero = async (genero: Genero) => {
    try {
      const response = await fetch(`${API_ROUTES.GENEROS}/${genero.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(genero),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setGeneros(generos.map((g) => (g.id === data.id ? data : g)));
      setEditandoGenero(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const eliminarGenero = async (id: number) => {
    try {
      const response = await fetch(`${API_ROUTES.GENEROS}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setGeneros(generos.filter((g) => g.id !== id));
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
              value={nuevoGenero.nombre}
              onChange={(e) =>
                setNuevoGenero({ ...nuevoGenero, nombre: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={nuevoGenero.estado}
                onChange={(e) =>
                  setNuevoGenero({ ...nuevoGenero, estado: e.target.checked })
                }
                className="mr-2"
              />
              Estado
            </label>
          </div>
          <div>
            <input
              type="text"
              placeholder="Descripción"
              value={nuevoGenero.descripcion}
              onChange={(e) =>
                setNuevoGenero({ ...nuevoGenero, descripcion: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <button
              onClick={crearGenero}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear
            </button>
          </div>
        </div>
      </div>
      {generos.map((genero) => (
        <div key={genero.id} className="mb-4 p-4 bg-white shadow rounded">
          {editandoGenero?.id === genero.id ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editandoGenero.nombre}
                  onChange={(e) =>
                    setEditandoGenero({
                      ...editandoGenero,
                      nombre: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editandoGenero.estado}
                    onChange={(e) =>
                      setEditandoGenero({
                        ...editandoGenero,
                        estado: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Estado
                </label>
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Descripción"
                  value={editandoGenero.descripcion}
                  onChange={(e) =>
                    setEditandoGenero({
                      ...editandoGenero,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarGenero(editandoGenero)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoGenero(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <p>{genero.nombre}</p>
              </div>
              <div className="col-span-4">
                <p>{genero.descripcion}</p>
              </div>
              <div className="col-span-2">
                <p>{genero.estado ? "Activo" : "Inactivo"}</p>
              </div>
              <div className="col-span-2 flex space-x-2">
                <IconButton
                  color="primary"
                  onClick={() => setEditandoGenero(genero)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => eliminarGenero(genero.id)}
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
