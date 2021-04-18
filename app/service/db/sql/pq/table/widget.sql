SET timezone="Asia/Shanghai";


CREATE TABLE IF NOT EXISTS "widget"
(
    id SERIAL UNIQUE NOT NULL,
    widget_id CHAR(36) PRIMARY KEY UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    type SMALLINT DEFAULT 0,
    name VARCHAR(100) UNIQUE NOT NULL,
    current_commit_id CHAR(36) DEFAULT NULL,
    status SMALLINT DEFAULT 0,
    creator VARCHAR(32) DEFAULT NULL,
    create_time TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP(6) DEFAULT NULL
);

CREATE INDEX idx_widget_name ON widget(name);
CREATE INDEX idx_widget__widget_id ON widget(widget_id);

CREATE OR REPLACE FUNCTION "update_timestamp"()
RETURNS TRIGGER AS $$
BEGIN
NEW.update_time = now();
RETURN NEW;
END;
$$ language "plpgsql";

CREATE TRIGGER "update_time" BEFORE UPDATE ON "widget"
FOR EACH ROW
EXECUTE PROCEDURE "update_timestamp"();

