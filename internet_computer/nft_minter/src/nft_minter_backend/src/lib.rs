mod types;
pub use types::*;
use ic_cdk::{query, update, api};
use std::str::FromStr;

fn mgmt_canister_id() -> CanisterId {
    CanisterId::from_str(&"aaaaa-aa").unwrap()
}

#[ic_cdk::query]
fn get_caller() -> String{
    let _caller = api::caller();
    format!("Hello! Your PrincipalId is: {}", _caller)
}
/// API
    
#[ic_cdk::query]
fn greet(name: String) -> String {
    format!("Hello, {}!", name)
}

#[ic_cdk::query]
fn eth_address() -> String {
    "0x1234567890abcdef".to_string()
}

#[ic_cdk::update]
async fn public_key() -> Result<PublicKeyReply, String> {
    let request = ECDSAPublicKey {
        canister_id: None,
        derivation_path: vec![],
        key_id: EcdsaKeyIds::TestKeyLocalDevelopment.to_key_id(),
    };

    let (res,): (ECDSAPublicKeyReply,) =
        ic_cdk::call(mgmt_canister_id(), "ecdsa_public_key", (request,))
            .await
            .map_err(|e| format!("ecdsa_public_key failed {}", e.1))?;

    Ok(PublicKeyReply {
        public_key_hex: hex::encode(&res.public_key),
    })
}

