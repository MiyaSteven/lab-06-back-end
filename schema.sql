<<<<<<< Updated upstream
DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    search_query VARCHAR(255),
    formatted_query VARCHAR(255),
    latitude NUMERIC(5,10),
    longitude NUMERIC(5,10)
);

INSERT INTO locations (search_query, formatted_query, latitude, longitude) VALUES ('$1', '$2', '$3', '$4');

SELECT * FROM locations;
=======
-- DROP TABLE IF EXISTS locations;

-- CREATE TABLE locations (
--     id SERIAL PRIMARY KEY
--     -- city VARCHAR(255),
--     -- city_data VARCHAR(255),
--     -- latitude VARCHAR(255),
--     -- longitude VARCHAR(255)
-- );

-- INSERT INTO locations (city) VALUES ($1);

-- SELECT * FROM locations;
DROP TABLE IF EXISTS locations;

CREATE TABLE locations (
    city VARCHAR(255),
    city_data VARCHAR(255),
    latitude VARCHAR(255),
    longitude VARCHAR(255)
);

-- INSERT INTO locations (city, city_data, latitude, longitude) VALUES ('$1', '$2', '$3', '$4');

-- SELECT * FROM locations;
>>>>>>> Stashed changes
