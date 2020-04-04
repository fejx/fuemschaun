FILE=fuemschaun.js
TARGET=/var/log/fuemschaun/nodejs
PID := `ps -aux | grep "[f]uemschaun.js" | awk '{print $$2}'`

.PHONY: install

install:
	npm i


prod: kill
	nohup node $(FILE) >> $(TARGET) 2>&1 &

kill:
	@if [ "$(strip $(PID))" != "" ]; then \
		echo "killing server with pid $(PID)"; \
		kill $(PID); \
	fi

dev:
	node $(FILE)
