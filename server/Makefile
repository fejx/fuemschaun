TARGET=/var/log/fuemschaun/nodejs
PID := `ps -aux | grep "[s]rc/index.mjs" | awk '{print $$2}'`

.PHONY: install

install:
	npm i


prod: kill
	NODE_ENV=production nohup npm run start >> $(TARGET) 2>&1 &

kill:
	@if [ "$(strip $(PID))" != "" ]; then \
		echo "killing server with pid $(PID)"; \
		kill $(PID); \
	fi

dev:
	npm run start
