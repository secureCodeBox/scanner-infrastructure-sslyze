# Node-SSLyze

NodeJS wrapper for SSLyze. Based on node-nmap.

## Requirements
* Requires NodeJS 8.x or greater. Installation instructions: https://nodejs.org/en/download/package-manager/

## Installation
`npm install`

## Running tests
`npm test`

## Scan Types
* `RegularScan` - Runs a regular SSLyze scan
 
## Scan instance variables, methods, and events
* `scanResults` : Array of host objects - contains the results of the scan.
* `scanTime` : number in ms - duration of scan.
* `startScan()` - begins the SSLyze scan.
* `cancelScan()` - kills the SSLyze process.
* `'complete'` : event - returns array of host objects
* `'error'` : event - returns string with error information

## Queued scans instance variables, methods, and events
* `scanTime` : number in ms - collective duration of all scans. 
* `currentScan` - reference to the current scan object if needed
* `'complete'` : event - triggers when entire queue has been processed.  Returns results Array.
* `'error'` : event - triggers when an error is encountered.  Returns error object.

## Usage
RegularScan is the core function of the package.  It emits two events: `'complete'` and `'error'`.  Both of these events return data.

The return structure is:

```javascript
{  
    "accepted_targets": [
      AcceptedTarget, ...
    ],
    "invalid_targets" : [
        {
          string: string
          // key: host, value: error message
        }, ...
    ],
    "sslyze_url" : string,
    "sslyze_version" : string,
    "total_scan_time" : string
}
```

### CommandsResults
```javascript
{
  "certinfo" : CertificateInfo,
  "compression" : Compression,
  "fallback" : Fallback,
  "heartbleed" : Heartbleed,
  "openssl_ccs" : OpensslCcs,
  "reneg" : Reneg,
  "resum" : Resum,
  "robot" : Robot,
  "sslv2" : Protocol,
  "sslv3" : Protocol,
  "tlsv1" : Protocol,
  "tlsv1_1" : Protocol,
  "tlsv1_2" : Protocol,
  "tlsv1_3" : Protocol
}
```

### AcceptedTarget
```javascript
{
  "commands_results" : CommandsResults,
  "server_info" : ServerConnectivityInfo
}
```

### ServerConnectivityInfo
```javascript
{
  "client_auth_credentials": ClientAuthenticationCredentials,
  "client_auth_requirement": string,
  "highest_ssl_version_supported": string,
  "hostname": string,
  "http_tunneling_settings": HttpConnectTunnelingSettings,
  "ip_address": string,
  "openssl_cipher_string_supported": string,
  "port": int,
  "tls_server_name_indication": string,
  "tls_wrapped_protocol": string,
  "xmpp_to_hostname": string
}
```

### ClientAuthenticationCredentials
```javascript
{
  "client_certificate_chain_path" : string,
  "client_key_path" : string,
  "client_key_type" : OpenSslFileTypeEnum,
  "client_key_password" : string
}
```

### HttpConnectTunnelingSettings
```javascript
{
  "hostname" : string
  "port" : int
  "basic_auth_user" : string
  "basic_auth_password" : string
}
```

### CertificateInfo
```javascript
{
  "certificate_chain": [Certificate, ...],
  "certificate_has_must_staple_extension" : bool,
  "certificate_included_scts_count" : int,
  "certificate_matches_hostname" : bool,
  "has_anchor_in_certificate_chain" : bool,
  "has_sha1_in_certificate_chain" : bool,
  "is_certificate_chain_order_valid" : bool,
  "is_leaf_certificate_ev" : bool,
  "is_ocsp_response_trusted" : bool|null,
  "ocsp_response" : *,
  "ocsp_reponse_status" : OcspResponseStatusEnum,
  "path_validation_error_list" : [PathValidationError, ...],
  "path_validation_result_list" : [PathValidationResult, ...],
  "successful_trust_store" : TrustStore,
  "symantec_distrust_timeline" : SymantecDistrustTimelineEnum,
  "verified_certificate_chain" : [Certificate, ...],
}
```

### OcspResponseStatusEnum
```
  "SUCCESSFUL",
  "MALFORMED_REQUEST",
  "INTERNAL_ERROR",
  "TRY_LATER",
  "SIG_REQUIRED",
  "UNAUTHORIZED"
```

### PathValidationResult
```javascript
{
  "trust_store" : TrustStore,
  "verify_string" : string,
  "is_certificate_trusted" : bool
}
```

### PathValidationError
```javascript
{
  "trust_store" : TrustStore,
  "error_message" : string
}
```

### TrustStore
```javascript
{
  "path" : string,
  "name" : string,
  "version" : string
}
```

### SymantecDistrustTimelineEnum
```
  "MARCH_2018",
  "SEPTEMBER_2018",
  ...
```

### Compression
```javascript
{
  "compression_name" : string
}
```

### Fallback
```javascript
{
  "supports_fallback_scsv" : bool
}
```

### Heartbleed
```javascript
{
  "is_vulnerable_to_heartbleed" : bool
}
```

### Openssl_Ccs
```javascript
{
  "is_vulnerable_to_ccs_injection" : bool
}
```

### Reneg
```javascript
{
  "accepts_client_renegotiation": bool,
  "supports_secure_renegotiation": bool,
  "error_message": string
}
```

### Resum
```javascript
{
  "attempted_resumptions_nb": int,
  "errored_resumptions_list": [ string ],
  "failed_resumptions_nb": int,
  "is_ticket_resumption_supported": bool,
  "successful_resumptions_nb": int,
  "ticket_resumption_error": string,
  "ticket_resumption_failed_reason": string
}
```

### Robot
```javascript
{
  "robot_result_enum" : RobotScanResultEnum
}
```

### RobotScanResultEnum
```
  "VULNERABLE_WEAK_ORACLE",
  "VULNERABLE_STRONG_ORACLE",
  "NOT_VULNERABLE_NO_ORACLE",
  "NOT_VULNERABLE_RSA_NOT_SUPPORTED",
  "UNKNOWN_INCONSISTENT_RESULTS"
```

### Protocol
```javascript
{
  "accepted_cipher_list" : [
    AcceptedCipherSuite, ...
  ],
  "errored_cipher_list" : [
    ErroredCipherSuite, ...
  ],
  "rejected_cipher_list" : [
    RejectedCipherSuite, ...
  ],
  "prefered_cipher" : AcceptedCipherSuite
}
```

### Certificate
```javascript
{
  "as_pem" : string,
  "hpkp_pin" : string,
  "issuer": string,
  "notAfter": string,
  "notBefore": string,
  "publicKey": PublicKey,
  "serialNumber": string,
  "signatureAlgorithm": string,
  "subject": string,
  "subjectAlternativeName": SubjectAlternativeName
}
```

### PublicKey
```javascript
{
  "algorithm": string,
  "exponent": string,
  "size": string
}
```

### SubjectAlternativeName
```javascript
{
  "DNS": [
    string,
    ...
  ]
}
```

### AcceptedCipherSuite
```javascript
{
  "dh_info": { ... },
  "is_anonymous": bool,
  "key_size": int,
  "openssl_name": string,
  "post_handshake_response": string,
  "ssl_version": string
}
```

### ErroredCipherSuite
```javascript
{
  "name" : string,
  "openssl_name" : string,
  "ssl_version" : string,
  "is_anonymous" : bool,
  "error_message" : string
}
```

### RejectedCipherSuite
```javascript
{
  "handshake_error_message": string,
  "is_anonymous": bool,
  "openssl_name": string,
  "ssl_version": string
}
```

## Examples

```javascript
var sslyze = require('node-sslyze');

sslyze.pythonLocation = "python3"; //default

// Accepts array or comma separated string of hosts
var scanner = new sslyze.RegularScan('127.0.0.1 google.com yahoo.com:443');

scanner.on('complete', function(data){
  console.log(data);
});

scanner.on('error', function(error){
  console.log(error);
});

scanner.startScan();
```