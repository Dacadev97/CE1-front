"use client";

import { useEffect, useState } from "react";
import API_ROUTES from "../app/services/api";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../app/layout";
import Navbar from "@/components/ui/navbar";

interface Productora {
  id: number;
  nombre: string;
  estado: boolean;
  fecha_creacion: string;
  fecha_actualizacion: string;
  slogan: string;
  descripcion: string;
}

export default function Productoras() {
  const [productoras, setProductoras] = useState<Productora[]>([]);
  const [nuevaProductora, setNuevaProductora] = useState({
    nombre: "",
    estado: true,
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    slogan: "",
    descripcion: "",
  });
  const [editandoProductora, setEditandoProductora] =
    useState<Productora | null>(null);

  useEffect(() => {
    const fetchProductoras = async () => {
      try {
        const response = await fetch(API_ROUTES.PRODUCTORAS);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProductoras(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };

    fetchProductoras();
  }, []);

  const crearProductora = async () => {
    try {
      const response = await fetch(API_ROUTES.PRODUCTORAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaProductora),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProductoras([...productoras, data]);
      setNuevaProductora({
        nombre: "",
        estado: true,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        slogan: "",
        descripcion: "",
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const editarProductora = async (productora: Productora) => {
    try {
      const response = await fetch(
        `${API_ROUTES.PRODUCTORAS}/${productora.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productora),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setProductoras(
        productoras.map((p) => (p.id === productora.id ? data : p))
      );
      setEditandoProductora(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const eliminarProductora = async (id: number) => {
    try {
      const response = await fetch(`${API_ROUTES.PRODUCTORAS}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setProductoras(productoras.filter((p) => p.id !== id));
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
              value={nuevaProductora.nombre}
              onChange={(e) =>
                setNuevaProductora({
                  ...nuevaProductora,
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
                checked={nuevaProductora.estado}
                onChange={(e) =>
                  setNuevaProductora({
                    ...nuevaProductora,
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
              value={nuevaProductora.descripcion}
              onChange={(e) =>
                setNuevaProductora({
                  ...nuevaProductora,
                  descripcion: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <button
              onClick={crearProductora}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Crear
            </button>
          </div>
        </div>
      </div>
      {productoras.map((productora) => (
        <div key={productora.id} className="mb-4 p-4 bg-white shadow rounded">
          {editandoProductora?.id === productora.id ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={editandoProductora.nombre}
                  onChange={(e) =>
                    setEditandoProductora({
                      ...editandoProductora,
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
                    checked={editandoProductora.estado}
                    onChange={(e) =>
                      setEditandoProductora({
                        ...editandoProductora,
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
                  value={editandoProductora.descripcion}
                  onChange={(e) =>
                    setEditandoProductora({
                      ...editandoProductora,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarProductora(editandoProductora)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoProductora(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4 items-center">
              <div className="col-span-4">
                <p>{productora.nombre}</p>
              </div>
              <div className="col-span-4">
                <p>{productora.descripcion}</p>
              </div>
              <div className="col-span-2">
                <p>{productora.estado ? "Activo" : "Inactivo"}</p>
              </div>
              <div className="col-span-2 flex space-x-2">
                <IconButton
                  color="primary"
                  onClick={() => setEditandoProductora(productora)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => eliminarProductora(productora.id)}
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
