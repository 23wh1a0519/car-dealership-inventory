# Test Report

## Car Dealership Inventory System

This document contains the results of the automated backend test suite for the Car Dealership Inventory System.

## Test Framework

- **Testing Framework:** pytest
- **Backend:** FastAPI
- **Database:** PostgreSQL
- **Python Version:** 3.11.9
- **Operating System:** Windows
- **Total Tests:** 17

## Test Execution

The complete backend test suite was executed using:

```bash
pytest -v


============================================================= test session starts =============================================================
platform win32 -- Python 3.11.9, pytest-9.1.1, pluggy-1.6.0 -- C:\Users\HP\OneDrive\Desktop\car-dealership-inventory\backend\venv\Scripts\python.exe
cachedir: .pytest_cache
rootdir: C:\Users\HP\OneDrive\Desktop\car-dealership-inventory\backend
plugins: anyio-4.14.2
collected 17 items

tests/test_auth.py::test_register_user PASSED                                                                                            [  5%]
tests/test_auth.py::test_login_user PASSED                                                                                               [ 11%]
tests/test_vehicles.py::test_create_vehicle PASSED                                                                                       [ 17%]
tests/test_vehicles.py::test_create_vehicle_requires_admin PASSED                                                                        [ 23%]
tests/test_vehicles.py::test_get_vehicles PASSED                                                                                         [ 29%]
tests/test_vehicles.py::test_search_vehicles_by_make PASSED                                                                              [ 35%]
tests/test_vehicles.py::test_search_vehicles_by_model PASSED                                                                             [ 41%]
tests/test_vehicles.py::test_search_vehicles_by_category PASSED                                                                          [ 47%]
tests/test_vehicles.py::test_search_vehicles_by_price_range PASSED                                                                       [ 52%]
tests/test_vehicles.py::test_update_vehicle PASSED                                                                                       [ 58%]
tests/test_vehicles.py::test_update_vehicle_requires_admin PASSED                                                                        [ 64%]
tests/test_vehicles.py::test_delete_vehicle_requires_admin PASSED                                                                        [ 70%]
tests/test_vehicles.py::test_admin_can_delete_vehicle PASSED                                                                             [ 76%]
tests/test_vehicles.py::test_purchase_vehicle PASSED                                                                                     [ 82%]
tests/test_vehicles.py::test_purchase_vehicle_out_of_stock PASSED                                                                        [ 88%]
tests/test_vehicles.py::test_restock_vehicle_requires_admin PASSED                                                                       [ 94%]
tests/test_vehicles.py::test_admin_can_restock_vehicle PASSED                                                                            [100%]

============================================================== warnings summary ===============================================================
venv\Lib\site-packages\fastapi\testclient.py:1
  C:\Users\HP\OneDrive\Desktop\car-dealership-inventory\backend\venv\Lib\site-packages\fastapi\testclient.py:1: StarletteDeprecationWarning: Using `httpx` with `starlette.testclient` is deprecated; install `httpx2` instead.
    from starlette.testclient import TestClient as TestClient  # noqa

app\schemas\auth.py:10
  C:\Users\HP\OneDrive\Desktop\car-dealership-inventory\backend\app\schemas\auth.py:10: PydanticDeprecatedSince20: Support for class-based `config` is deprecated, use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.13/migration/
    class UserResponse(BaseModel):

app\schemas\vehicle.py:10
  C:\Users\HP\OneDrive\Desktop\car-dealership-inventory\backend\app\schemas\vehicle.py:10: PydanticDeprecatedSince20: Support for class-based `config` is deprecated, use ConfigDict instead. Deprecated in Pydantic V2.0 to be removed in V3.0. See Pydantic V2 Migration Guide at https://errors.pydantic.dev/2.13/migration/
    class VehicleResponse(BaseModel):

-- Docs: https://docs.pytest.org/en/stable/how-to/capture-warnings.html
======================================================= 17 passed, 3 warnings in 4.66s ========================================================
