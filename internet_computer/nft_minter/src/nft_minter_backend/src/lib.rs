mod types;
pub use types::*;
use ic_cdk::{query, update, api};
use std::str::FromStr;

use ic_web3::transports::ICHttp;
use ic_web3::Web3;
use ic_web3::ic::{get_eth_addr, KeyInfo};
use ic_web3::{
    contract::{Contract, Options},
    ethabi::ethereum_types::{U64, U256},
    types::{Address, TransactionParameters, BlockId, BlockNumber, Block},
};


const URL: &str = "https://eth-sepolia.g.alchemy.com/v2/lkiR18auvOa-6fIWhwSCUMw6KdMbcAM_";
const CHAIN_ID: u64 = 11155111;
const KEY_NAME: &str = "dfx_test_key";
const TOKEN_ABI: &[u8] = include_bytes!("../Gate23Token.json");

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

fn sha256(input: &String) -> [u8; 32] {
    use sha2::Digest;
    let mut hasher = sha2::Sha256::new();
    hasher.update(input.as_bytes());
    hasher.finalize().into()
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

#[update]
async fn sign(message: String) -> Result<SignatureReply, String> {
    let request = SignWithECDSA {
        message_hash: sha256(&message).to_vec(),
        derivation_path: vec![],
        key_id: EcdsaKeyIds::TestKeyLocalDevelopment.to_key_id(),
    };

    let (response,): (SignWithECDSAReply,) = ic_cdk::api::call::call_with_payment(
        mgmt_canister_id(),
        "sign_with_ecdsa",
        (request,),
        25_000_000_000,
    )
    .await
    .map_err(|e| format!("sign_with_ecdsa failed {}", e.1))?;

    Ok(SignatureReply {
        signature_hex: hex::encode(&response.signature),
    })
}

#[update]
async fn get_canister_addr() -> Result<String, String> {
    match get_eth_addr(None, None, KEY_NAME.to_string()).await {
        Ok(addr) => { Ok(hex::encode(addr)) },
        Err(e) => { Err(e) },
    }
}

#[update]
async fn get_eth_balance(addr: String) -> Result<String, String> {
    let w3 = match ICHttp::new(URL, None) {
        Ok(v) => { Web3::new(v) },
        Err(e) => { return Err(e.to_string()) },
    };
    let balance = w3.eth().balance(Address::from_str(&addr).unwrap(), None).await.map_err(|e| format!("get balance failed: {}", e))?;
    Ok(format!("{}", balance))
}

// #[update]
// async fn send_eth(to: String, value: u64) -> Result<String, String> {
//     // ecdsa key info
//     let derivation_path = vec![ic_cdk::id().as_slice().to_vec()];
//     let key_info = KeyInfo{ derivation_path: derivation_path, key_name: KEY_NAME.to_string() };

//     // get canister eth address
//     let from_addr = get_eth_addr(None, None, KEY_NAME.to_string())
//         .await
//         .map_err(|e| format!("get canister eth addr failed: {}", e))?;
//     // get canister the address tx count
//     let w3 = match ICHttp::new(URL, None) {
//         Ok(v) => { Web3::new(v) },
//         Err(e) => { return Err(e.to_string()) },
//     };
//     let tx_count = w3.eth()
//         .transaction_count(from_addr, None)
//         .await
//         .map_err(|e| format!("get tx count error: {}", e))?;
        
//     ic_cdk::println!("canister eth address {} tx count: {}", hex::encode(from_addr), tx_count);
//     // construct a transaction
//     let to = Address::from_str(&to).unwrap();
//     let tx = TransactionParameters {
//         to: Some(to),
//         nonce: Some(tx_count), // remember to fetch nonce first
//         value: U256::from(value),
//         gas_price: Some(U256::exp10(10)), // 10 gwei
//         gas: U256::from(21000),
//         ..Default::default()
//     };
//     // sign the transaction and get serialized transaction + signature
//     let signed_tx = w3.accounts()
//         .sign_transaction(tx, key_info, CHAIN_ID)
//         .await
//         .map_err(|e| format!("sign tx error: {}", e))?;
//     match w3.eth().send_raw_transaction(signed_tx.raw_transaction).await {
//         Ok(txhash) => { 
//             ic_cdk::println!("txhash: {}", hex::encode(txhash.0));
//             Ok(format!("{}", hex::encode(txhash.0)))
//         },
//         Err(e) => { Err(e.to_string()) },
//     }
// }


