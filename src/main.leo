
// # Example: born in 2000, check in 2025 → true
// leo run prove_is_adult 2000u16 2025u16
// # Example: born in 2010 → false
// leo run prove_is_adult 2010u16 2025u16

// To deploy:
// export PRIVATE_KEY="APrivateKey1zkpYourActualPrivateKeyHere"
// Check that it’s loaded: echo $PRIVATE_KEY
// export ENDPOINT="https://api.explorer.provable.com/v1/testnet"
// Check that it’s loaded: echo $ENDPOINT

// PoC: prove (current_year - birth_year) >= 18
// birth_year will be provided privately at execution time
// current_year is provided as a public input so verifiers know *what* was checked
// The function returns a PUBLIC boolean so anyone can read the result.

program zk_age_20251109.aleo {

    transition prove_is_adult(birth_year: u16, public current_year: u16) -> bool {
        assert(birth_year <= current_year);
        
        let age: u16 = current_year - birth_year;
        return age >= 18u16;
    }

}