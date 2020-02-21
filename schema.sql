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
