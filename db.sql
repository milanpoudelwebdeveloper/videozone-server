CREATE TABLE channels (
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    img VARCHAR(255), 
    subscribers INT DEFAULT 0,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);



ALTER TABLE channels ADD COLUMN description VARCHAR(255);

CREATE TABLE subscriptions (
    id SERIAL NOT NULL PRIMARY KEY,
    subscriberId INT NOT NULL REFERENCES channels(id),
    channelId INT NOT NULL REFERENCES channels(id),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE video (
    id SERIAL NOT NULL PRIMARY KEY,
    channelId INT NOT NULL REFERENCES channels(id),
    title VARCHAR(255) NOT NULL,
    descp VARCHAR(255) NOT NULL,
    videoUrl VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
    thumbnail VARCHAR(255),
    videoViews INT NOT NULL DEFAULT 0
);

ALTER TABLE video ADD COLUMN category VARCHAR(255);


CREATE TABLE comments (
    id SERIAL NOT NULL PRIMARY KEY,
    videoId INT NOT NULL REFERENCES video(id),
    userId INT NOT NULL REFERENCES channels(id),
    comment VARCHAR(255) NOT NULL
);

CREATE TABLE tags (
    id SERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    createdAt NOT NULL DEFAULT NOW(),
    videoId INT NOT NULL REFERENCES video(id)
);


-- here value 1 represents likes and 0 represents dislikes

CREATE TABLE likes (
    id SERIAL NOT NULL PRIMARY KEY,
    videoId INT NOT NULL REFERENCES video(id),
    userId INT NOT NULL REFERENCES channels(id),
    likeValue INT,
    liked BOOLEAN NOT NULL DEFAULT FALSE
);


CREATE TABLE dislikes (
    id SERIAL NOT NULL PRIMARY KEY,
    videoId INT NOT NULL REFERENCES video(id),
    userId INT NOT NULL REFERENCES users(id)
);



CREATE TABLE comments (
    id SERIAL NOT NULL PRIMARY KEY,
    videoId INT NOT NULL REFERENCES video(id),
    userId INT NOT NULL REFERENCES channels(id),
    comment VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);


CREATE TABLE playlists (
    id SERIAL NOT NULL PRIMARY KEY,
    channelId INT NOT NULL REFERENCES channels(id),
    title VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
   
);

ALTER TABLE playlists ADD COLUMN private BOOLEAN NOT NULL DEFAULT FALSE;


CREATE TABLE playlistVideo (
    id SERIAL NOT NULL PRIMARY KEY,
    playlistId INT NOT NULL REFERENCES playlists(id),
    videoId INT NOT NULL REFERENCES video(id),
    createdAt TIMESTAMP NOT NULL DEFAULT NOW()
)