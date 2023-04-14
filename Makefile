.PHONY: format lint


lint:
	black . --check
	ruff .
	mypy .

format:
	black .
	ruff --fix .