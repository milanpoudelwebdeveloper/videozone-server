CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY
    name VARCHAR(255) NOT NULL
    email VARCHAR(255) NOT NULL UNIQUE
    password VARCHAR(255) NOT NULL
    img VARCHAR(255) 
    subscribers INT DEFAULT 0
    createdAt NOT NULL DEFAULT NOW()
);


CREATE TABLE subscriptions (
    id SERIAL NOT NULL PRIMARY KEY
    subscriberId INT NOT NULL
    userId INT NOT NULL REFERENCES users(id)
    createdAt NOT NULL DEFAULT NOW()
);

CREATE TABLE video (
    id SERIAL NOT NULL PRIMARY KEY
    userId INT NOT NULL REFERENCES users(id)
    title VARCHAR(255) NOT NULL
    descp VARCHAR(255) NOT NULL
    videUrl VARCHAR(255) NOT NULL
    createdAt NOT NULL DEFAULT NOW()
    thumbnail VARCHAR(255)
    videoViews INT NOT NULL DEFAULT 0
)


CREATE TABLE tags (
    id SERIAL NOT NULL PRIMARY KEY
    title VARCHAR(255) NOT NULL
    createdAt NOT NULL DEFAULT NOW()
    videoId INT NOT NULL REFERENCES video(id)
);



CREATE TABLE likes (
    id SERIAL NOT NULL PRIMARY KEY
    videoId INT NOT NULL REFERENCES video(id)
    userId INT NOT NULL REFERENCES users(id)
);


CREATE TABLE dislikes (
    id SERIAL NOT NULL PRIMARY KEY
    videoId INT NOT NULL REFERENCES video(id)
    userId INT NOT NULL REFERENCES users(id)
);



CREATE TABLE comments (
    id SERIAL NOT NULL PRIMARY KEY
    videoId INT NOT NULL REFERENCES video(id)
    userId INT NOT NULL REFERENCES users(id)
    comment VARCHAR(255) NOT NULL
);

