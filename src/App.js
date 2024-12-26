import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";

const instance = axios.create({
  baseURL: "https://6037a0795435040017722e41.mockapi.io/movies",
});

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error);
  }
);

const App = () => {
  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState({
    title: "",
    genre: "",
    duration: "",
  });
  const [isUpdate, setIsUpdate] = useState(false);

  const { isFetching, error, data, refetch } = useQuery({
    queryKey: ["movies"],
    queryFn: async () => {
      const response = await fetch(
        "https://6037a0795435040017722e41.mockapi.io/movies"
      );
      return await response.json();
    },
  });
  console.log(data);

  const getMoves = async () => {
    try {
      const result = await instance.get();
      setMovies(result.data);
    } catch (error) {
      setMovies([]);
    }

    // axios
    //   .get("https://6037a0795435040017722e41.mockapi.io/movies")
    //   .then((res) => {
    //     setMovies(res.data);
    //   })
    //   .catch((error) => {
    //     setMovies([]);
    //   });
  };
  const addMovie = () => {
    if (isUpdate) {
      // ..
      // get, post, delete
      instance.put(`/${newMovie.id}`, newMovie).then(() => {
        alert("Cap nhat thanh cong");
        getMoves();
      });
    } else {
      // if (newMovie.title && newMovie.genre && newMovie.duration) {
      //   setMovies([...movies, { id: Date.now(), ...newMovie }]);
      //   setNewMovie({ title: "", genre: "", duration: "" });
      // }
      instance.post("", newMovie).then((res) => {
        alert("Them thanh cong");
        getMoves();
      });
    }
  };

  const removeMovie = (id) => {
    // setMovies(movies.filter((movie) => movie.id !== id));
    instance.delete(`/${id}`).then((res) => {
      alert("Xoa thanh cong");
      // getMoves();
      refetch();
    });
  };
  const updateMovie = (id) => {
    setIsUpdate(true);
    const selectedMovie = movies.find((movie) => movie.id === id);
    setNewMovie(selectedMovie);
  };
  useEffect(() => {
    getMoves();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Theater Movie Manager 🎥
      </h1>

      {/* Add Movie Form */}
      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Add New Movie</h2>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Movie Title"
            className="p-2 border rounded-md"
            value={newMovie.title}
            onChange={(e) =>
              setNewMovie({ ...newMovie, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Genre"
            className="p-2 border rounded-md"
            value={newMovie.genre}
            onChange={(e) =>
              setNewMovie({ ...newMovie, genre: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Duration (e.g., 2h 30m)"
            className="p-2 border rounded-md"
            value={newMovie.duration}
            onChange={(e) =>
              setNewMovie({ ...newMovie, duration: e.target.value })
            }
          />
          <button
            onClick={addMovie}
            className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
            {isUpdate ? "Update Movie" : "Add Movie"}
          </button>
        </div>
      </div>

      {/* Movie List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-3">Current Movies</h2>
        {isFetching ? (
          <p className="text-gray-500">Loading...</p>
        ) : data.length > 0 ? (
          <ul className="space-y-4">
            {data.map((movie) => (
              <li
                key={movie.id}
                className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm">
                <div>
                  <h3 className="text-lg font-bold">{movie.title}</h3>
                  <p className="text-sm text-gray-500">
                    Genre: {movie.genre} | Duration: {movie.duration}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => updateMovie(movie.id)}
                    className="text-blue-500 hover:text-blue-700 font-semibold">
                    Update
                  </button>
                  <button
                    onClick={() => removeMovie(movie.id)}
                    className="text-red-500 hover:text-red-700 font-semibold">
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No movies added yet.</p>
        )}
      </div>
    </div>
  );
};

export default App;
