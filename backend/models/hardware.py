def get_all_hardware(db) -> list:
    hw = db["hardware"]
    return list(hw.find({}, {"_id": 0}))


def get_hardware_set(db, name: str) -> dict | None:
    hw = db["hardware"]
    return hw.find_one({"name": name}, {"_id": 0})


def checkout_hardware(db, hw_set_name: str, quantity: int) -> dict:
    """Decrease availability by quantity. Raises if not enough available."""
    hw = db["hardware"]
    hw_set = hw.find_one({"name": hw_set_name})

    if not hw_set:
        raise ValueError(f"Hardware set '{hw_set_name}' not found")

    if quantity <= 0:
        raise ValueError("Quantity must be positive")

    if quantity > hw_set["availability"]:
        raise ValueError(
            f"Requested {quantity} but only {hw_set['availability']} available"
        )

    hw.update_one(
        {"name": hw_set_name}, {"$inc": {"availability": -quantity}}
    )

    updated = hw.find_one({"name": hw_set_name}, {"_id": 0})
    return updated


def checkin_hardware(db, hw_set_name: str, quantity: int) -> dict:
    """Increase availability by quantity. Cannot exceed capacity."""
    hw = db["hardware"]
    hw_set = hw.find_one({"name": hw_set_name})

    if not hw_set:
        raise ValueError(f"Hardware set '{hw_set_name}' not found")

    if quantity <= 0:
        raise ValueError("Quantity must be positive")

    new_availability = hw_set["availability"] + quantity
    if new_availability > hw_set["capacity"]:
        raise ValueError(
            f"Check-in would exceed capacity ({hw_set['capacity']}). "
            f"Currently {hw_set['availability']} available."
        )

    hw.update_one(
        {"name": hw_set_name}, {"$inc": {"availability": quantity}}
    )

    updated = hw.find_one({"name": hw_set_name}, {"_id": 0})
    return updated
