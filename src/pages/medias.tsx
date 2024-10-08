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
  const [directores, setDirectores] = useState<
    { id: number; nombres: string }[]
  >([]);
  const [productoras, setProductoras] = useState<
    { id: number; nombre: string }[]
  >([]);
  const [tipos, setTipos] = useState<{ id: number; nombre: string }[]>([]);

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

  useEffect(() => {
    fetch(API_ROUTES.DIRECTORES)
      .then((response) => response.json())
      .then((data) => setDirectores(data));
  }, []);

  useEffect(() => {
    fetch(API_ROUTES.PRODUCTORAS)
      .then((response) => response.json())
      .then((data) => setProductoras(data));
  }, []);

  useEffect(() => {
    fetch(API_ROUTES.TIPOS)
      .then((response) => response.json())
      .then((data) => setTipos(data));
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
          <div>
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
            <label className="flex items-center">
              Director:
              <select
                name="director_id"
                value={nuevaMedia.director_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un director</option>
                {directores.map((director) => (
                  <option key={director.id} value={director.id}>
                    {director.nombres}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              Productora:
              <select
                name="productora_id"
                value={nuevaMedia.productora_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccione una productora</option>
                {productoras.map((productora) => (
                  <option key={productora.id} value={productora.id}>
                    {productora.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              Tipo:
              <select
                name="tipo_id"
                value={nuevaMedia.tipo_id}
                onChange={handleInputChange}
              >
                <option value="">Seleccione un tipo</option>
                {tipos.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nombre}
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
                  placeholder="Imagen Portada"
                  value={editandoMedia.imagen_portada}
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
                <label className="flex items-center">
                  Año de estreno:
                  <DatePicker
                    selected={setYear(
                      new Date(),
                      editandoMedia?.año_estreno || nuevaMedia.año_estreno
                    )}
                    onChange={(date) => {
                      if (date) {
                        setEditandoMedia({
                          ...editandoMedia,
                          año_estreno: date.getFullYear(),
                        } as Media);
                      }
                    }}
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
                    value={editandoMedia.genero_id}
                    onChange={(e) =>
                      setEditandoMedia({
                        ...editandoMedia,
                        genero_id: Number(e.target.value),
                      })
                    }
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
                <label className="flex items-center">
                  Director:
                  <select
                    name="director_id"
                    value={editandoMedia.director_id}
                    onChange={(e) =>
                      setEditandoMedia({
                        ...editandoMedia,
                        director_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccione un director</option>
                    {directores.map((director) => (
                      <option key={director.id} value={director.id}>
                        {director.nombres}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  Productora:
                  <select
                    name="productora_id"
                    value={editandoMedia.productora_id}
                    onChange={(e) =>
                      setEditandoMedia({
                        ...editandoMedia,
                        productora_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccione una productora</option>
                    {productoras.map((productora) => (
                      <option key={productora.id} value={productora.id}>
                        {productora.nombre}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  Tipo:
                  <select
                    name="tipo_id"
                    value={editandoMedia.tipo_id}
                    onChange={(e) =>
                      setEditandoMedia({
                        ...editandoMedia,
                        tipo_id: Number(e.target.value),
                      })
                    }
                  >
                    <option value="">Seleccione un tipo</option>
                    {tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </label>
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
            <div className="flex flex-col p-4 border border-gray-300 rounded shadow-md">
              <div className="mb-2">
                <strong>Título:</strong> {media.titulo}
              </div>
              <div className="mb-2">
                <strong>Sinopsis:</strong> {media.sinopsis}
              </div>
              <div className="mb-2">
                <strong>URL Película:</strong> {media.url_pelicula}
              </div>
              <div className="mb-2">
                <strong>Imagen Portada:</strong>
                <img
                  src={media.imagen_portada}
                  alt={media.titulo}
                  className="w-full h-auto mt-2"
                />
              </div>
              <div className="mb-2">
                <strong>Año de estreno:</strong> {media.año_estreno}
              </div>
              <div className="mb-2">
                <strong>Género:</strong>{" "}
                {
                  generos.find((genero) => genero.id === media.genero_id)
                    ?.nombre
                }
              </div>
              <div className="mb-2">
                <strong>Director:</strong>{" "}
                {
                  directores.find(
                    (director) => director.id === media.director_id
                  )?.nombres
                }
              </div>
              <div className="mb-2">
                <strong>Productora:</strong>{" "}
                {
                  productoras.find(
                    (productora) => productora.id === media.productora_id
                  )?.nombre
                }
              </div>
              <div className="mb-2">
                <strong>Tipo:</strong>{" "}
                {tipos.find((tipo) => tipo.id === media.tipo_id)?.nombre}
              </div>

              <div className="flex space-x-2 mt-4">
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
