"use client";

import { useEffect, useState } from "react";
import API_ROUTES from "../app/services/api";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../app/layout";
import Navbar from "@/components/ui/navbar";

interface Director {
  id: number;
  nombres: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export default function Directores() {
  const [directores, setDirectores] = useState<Director[]>([]);
  const [nuevoDirector, setNuevoDirector] = useState({
    nombres: "",
    estado: true,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
  });
  const [editandoDirector, setEditandoDirector] = useState<Director | null>(
    null
  );

  useEffect(() => {
    const fetchDirectores = async () => {
      try {
        const response = await fetch(API_ROUTES.DIRECTORES);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setDirectores(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchDirectores();
  }, []);

  const crearDirector = async () => {
    try {
      const response = await fetch(API_ROUTES.DIRECTORES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoDirector),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDirectores([...directores, data]);
      setNuevoDirector({
        nombres: "",
        estado: true,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const editarDirector = async (director: Director) => {
    try {
      const response = await fetch(`${API_ROUTES.DIRECTORES}/${director.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(director),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setDirectores(directores.map((g) => (g.id === data.id ? data : g)));
      setEditandoDirector(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const eliminarDirector = async (id: number) => {
    try {
      const response = await fetch(`${API_ROUTES.DIRECTORES}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setDirectores(directores.filter((g) => g.id !== id));
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
              value={nuevoDirector.nombres}
              onChange={(e) =>
                setNuevoDirector({ ...nuevoDirector, nombres: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={nuevoDirector.estado}
                onChange={(e) =>
                  setNuevoDirector({
                    ...nuevoDirector,
                    estado: e.target.checked,
                  })
                }
                className="mr-2"
              />
              Estado
            </label>
          </div>
          <div></div>
          <div>
            <button
              onClick={crearDirector}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear
            </button>
          </div>
        </div>
      </div>
      {directores.map((director) => (
        <div key={director.id} className="mb-4 p-4 bg-white shadow rounded">
          {editandoDirector?.id === director.id ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editandoDirector.nombres}
                  onChange={(e) =>
                    setEditandoDirector({
                      ...editandoDirector,
                      nombres: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editandoDirector.estado}
                    onChange={(e) =>
                      setEditandoDirector({
                        ...editandoDirector,
                        estado: e.target.checked,
                      })
                    }
                    className="mr-2"
                  />
                  Estado
                </label>
              </div>
              <div></div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarDirector(editandoDirector)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoDirector(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <p>{director.nombres}</p>
              </div>
              <div className="col-span-2">
                <p>{director.estado ? "Activo" : "Inactivo"}</p>
              </div>
              <div className="col-span-2 flex space-x-2">
                <IconButton
                  color="primary"
                  onClick={() => setEditandoDirector(director)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => eliminarDirector(director.id)}
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
