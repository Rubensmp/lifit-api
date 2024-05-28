import argon2 from 'argon2';

export async function verify(hash: string, password: string): Promise<boolean> {
  try {
    return argon2.verify(hash, password);
  } catch (err) {
    console.log('Error verifying password:', err);
    return false; // Retorna false para indicar que a verificação falhou
  }
}

export async function hash(password: string): Promise<string | null> {
  try {
    return argon2.hash(password);
  } catch (err) {
    console.log('Error hashing password:', err);
    return null;
  }
}
