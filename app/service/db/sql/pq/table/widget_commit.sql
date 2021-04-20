SET timezone="Asia/Shanghai";

CREATE TABLE IF NOT EXISTS "widget_commit"
(
    id SERIAL UNIQUE NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    type VARCHAR(32) NOT NULL,
    widget_id CHAR(36) PRIMARY KEY UNIQUE NOT NULL,
    commit_id CHAR(36) UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    src TEXT NOT NULL,
    pkg_name TEXT NOT NULL,
    pkg_version TEXT NOT NULL,
    creator VARCHAR(32) DEFAULT '',
    create_time TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_widget_commit_name ON widget_commit(name);
CREATE INDEX idx_widget_commit_widget_id ON widget_commit(widget_id);