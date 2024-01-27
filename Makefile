.DEFAULT_GOAL := default

default:
	@echo "Running dev server: uvicorn main:app --reload"
	@uvicorn main:app --reload

prod:
	@echo "Running prod server with: uvicorn main:app"
	@uvicorn main:app

format:
	@echo "Running formatting with: python -m black ."
	@python -m black .
