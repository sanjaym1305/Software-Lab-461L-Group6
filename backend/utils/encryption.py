"""
Password encryption utilities using bcrypt.
Provides hashing and verification for user credentials.
"""

import bcrypt


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def check_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))


# ---------- Custom cipher (supplementary encryption layer) ----------
# Required by SN1 / SR3: "mechanism for encrypting user-id and password"

def _shift_char(c: int, shift: int) -> int:
    return (c + shift) % 256


def encrypt(text: str, shift: int = 3) -> str:
    return "".join(chr(_shift_char(ord(c), shift)) for c in text)


def decrypt(text: str, shift: int = 3) -> str:
    return "".join(chr(_shift_char(ord(c), -shift)) for c in text)
