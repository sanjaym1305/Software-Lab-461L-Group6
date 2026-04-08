from utils.encryption import hash_password, check_password, encrypt, decrypt


def test_hash_and_check_password():
    password = "my_super_secret_password!123"
    
    # Hashing should produce different outputs due to unique salts
    hash1 = hash_password(password)
    hash2 = hash_password(password)
    
    assert hash1 != hash2
    assert hash1 != password
    
    # However, checking the original password against either hash must succeed
    assert check_password(password, hash1) is True
    assert check_password(password, hash2) is True


def test_check_password_failure():
    password = "correct_horse_battery_staple"
    hashed = hash_password(password)
    
    # Check against wrong passwords
    assert check_password("wrong_password", hashed) is False
    assert check_password("", hashed) is False
    assert check_password("CORRECT_HORSE_BATTERY_STAPLE", hashed) is False


def test_custom_cipher_encryption_decryption():
    original_text = "Hello World! 123 @#$"
    
    # Test default shift
    encrypted = encrypt(original_text)
    assert encrypted != original_text
    assert decrypt(encrypted) == original_text
    
    # Test custom shift
    encrypted_custom = encrypt(original_text, shift=10)
    assert encrypted_custom != original_text
    assert encrypted_custom != encrypted
    assert decrypt(encrypted_custom, shift=10) == original_text


def test_cipher_empty_string():
    assert encrypt("") == ""
    assert decrypt("") == ""
