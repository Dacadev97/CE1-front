"use client";

import { useEffect, useState } from "react";
import API_ROUTES from "../app/services/api";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Layout from "../app/layout";
import Navbar from "@/components/ui/navbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setYear } from "date-fns";

interface Media {
  id: number;
  titulo: string;
  sinopsis: string;
  url_pelicula: string;
  imagen_portada: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  año_estreno: number;
  genero_id: number;
  director_id: number;
  productora_id: number;
  tipo_id: number;
}

export default function Medias() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [generos, setGeneros] = useState<{ id: number; nombre: string }[]>([]);
  const [nuevaMedia, setNuevaMedia] = useState({
    titulo: "",
    sinopsis: "",
    url_pelicula: "",
    imagen_portada: "",
    fecha_creacion: new Date().toISOString(),
    fecha_actualizacion: new Date().toISOString(),
    año_estreno: 1900,
    genero_id: 0,
    director_id: 0,
    productora_id: 0,
    tipo_id: 0,
  });
  const [editandoMedia, setEditandoMedia] = useState<Media | null>(null);

  useEffect(() => {
    fetch(API_ROUTES.GENEROS)
      .then((response) => response.json())
      .then((data) => setGeneros(data));
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNuevaMedia({
      ...nuevaMedia,
      [name]: value,
    });
  };

  useEffect(() => {
    const fetchMedias = async () => {
      try {
        const response = await fetch(API_ROUTES.MEDIAS);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setMedias(data);
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    };
    fetchMedias();
  }, []);

  const crearMedia = async () => {
    try {
      const response = await fetch(API_ROUTES.MEDIAS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaMedia),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMedias([...medias, data]);
      setNuevaMedia({
        titulo: "",
        sinopsis: "",
        url_pelicula: "",
        imagen_portada: "",
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
        año_estreno: 0,
        genero_id: 0,
        director_id: 0,
        productora_id: 0,
        tipo_id: 0,
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const editarMedia = async (media: Media) => {
    try {
      const response = await fetch(`${API_ROUTES.MEDIAS}/${media.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(media),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setMedias(medias.map((item) => (item.id === media.id ? data : item)));
      setEditandoMedia(null);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const eliminarMedia = async (id: number) => {
    try {
      const response = await fetch(`${API_ROUTES.MEDIAS}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMedias(medias.filter((item) => item.id !== id));
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

  const handleYearChange = (date: Date | null) => {
    if (date) {
      setNuevaMedia({
        ...nuevaMedia,
        año_estreno: date.getFullYear(),
      });
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
              placeholder="Título"
              value={nuevaMedia.titulo}
              onChange={(e) =>
                setNuevaMedia({
                  ...nuevaMedia,
                  titulo: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
          <div></div>
          <input
            type="text"
            placeholder="Sinopsis"
            value={nuevaMedia.sinopsis}
            onChange={(e) =>
              setNuevaMedia({
                ...nuevaMedia,
                sinopsis: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="URL Película"
            value={nuevaMedia.url_pelicula}
            onChange={(e) =>
              setNuevaMedia({
                ...nuevaMedia,
                url_pelicula: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Imagen Portada"
            value={nuevaMedia.imagen_portada}
            onChange={(e) =>
              setNuevaMedia({
                ...nuevaMedia,
                imagen_portada: e.target.value,
              })
            }
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="flex items-center">
            Año de estreno:
            <DatePicker
              selected={setYear(new Date(), nuevaMedia.año_estreno)}
              onChange={handleYearChange}
              showYearPicker
              dateFormat="yyyy"
              className="w-full p-2 border border-gray-300 rounded"
            />
          </label>
        </div>
        <div>
          <label className="flex items-center">
            Género:
            <select
              name="genero_id"
              value={nuevaMedia.genero_id}
              onChange={handleInputChange}
            >
              <option value="">Seleccione un género</option>
              {generos.map((genero) => (
                <option key={genero.id} value={genero.id}>
                  {genero.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <button
            onClick={crearMedia}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </div>
      </div>

      {medias.map((media) => (
        <div key={media.id} className="mb-4 p-4 bg-white shadow rounded">
          {editandoMedia?.id === media.id ? (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Titulo"
                  value={editandoMedia.titulo}
                  onChange={(e) =>
                    setEditandoMedia({
                      ...editandoMedia,
                      titulo: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Sinopsis"
                  value={editandoMedia.sinopsis}
                  onChange={(e) =>
                    setEditandoMedia({
                      ...editandoMedia,
                      sinopsis: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="URL Película"
                  value={editandoMedia.url_pelicula}
                  onChange={(e) =>
                    setEditandoMedia({
                      ...editandoMedia,
                      url_pelicula: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="URL Película"
                  value={editandoMedia.url_pelicula}
                  onChange={(e) =>
                    setEditandoMedia({
                      ...editandoMedia,
                      url_pelicula: e.target.value,
                    })
                  }
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => editarMedia(editandoMedia)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditandoMedia(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-0">
                <p>{media.titulo}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p>{media.sinopsis}</p>
              </div>

              <div className="flex space-x-2">
                <IconButton
                  color="primary"
                  onClick={() => setEditandoMedia(media)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => eliminarMedia(media.id)}
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
