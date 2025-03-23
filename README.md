# API Exploration & Testing 

This repository contains scripts to test the behavior of an autocomplete API, including case sensitivity, rate limits, and query constraints.

---

## 📌 How to Run This Script

### 1️⃣ Install Dependencies  
If you haven't installed the required dependencies, run:  
```sh
npm install
```
### 2️⃣ Run the Script
Execute the script using
```sh
node <filename>.js
```
(Replace <filename> with the actual script name, e.g., totalwordCount.js.)





##  API Case Sensitivity Test (`checkCaseSensitivity.js`)

###  Results:  
- **V1:** Case-sensitive (treats 'a' and 'A' as different inputs)  
- **V2:** Case-sensitive (same behavior)  
- **V3:** Case-sensitive (same behavior)  

✅ All versions differentiate between uppercase and lowercase queries.

---

## 🚦 API Rate Limit Test (`checkRateLimit.js`)

### ⏳ Limits per API version:  
| API Version | Max Requests | Reset Time |
|-------------|-------------|------------|
| **V1**      | 100         | 1 min      |
| **V2**      | 50          | 1 min      |
| **V3**      | 80          | 1 min      |

 Each version enforces a different request limit before blocking further queries.

---

##  API Query Constraint Test (`testQueryConstraints.js`)

### 📌 Behavior by API Version  

####  V1:
✔ Accepts **lowercase** letters  
❌ Rejects **uppercase, mixed case, numbers, alphanumeric, and special characters**  
✔ Returns results for **empty** and **whitespace queries**  

#### V2:  
✔ Accepts **lowercase** letters  
❌ Rejects **uppercase, mixed case, numbers, alphanumeric, and special characters**  
✔ Returns results for **empty** and **whitespace queries**  

####  V3:  
✔ Accepts **lowercase** letters  
❌ Rejects **uppercase, mixed case, numbers, alphanumeric, and special characters**  
✔ Returns results for **empty** and **whitespace queries**  

⚠️ The API **only** recognizes lowercase queries but still returns results for empty/whitespace inputs.

---

## 📈 Final Summary (`totalwordCount.js`)

###  Requests & Results  
| API Version | Requests Made | Results Found |
|-------------|--------------|--------------|
| **V1**      | 334          | 260          |
| **V2**      | 566          | 492          |
| **V3**      | 623          | 570          |



