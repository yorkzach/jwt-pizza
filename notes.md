# Learning notes

## JWT Pizza code study and debugging

As part of `Deliverable ⓵ Development deployment: JWT Pizza`, start up the application and debug through the code until you understand how it works. During the learning process fill out the following required pieces of information in order to demonstrate that you have successfully completed the deliverable.

| User activity                                       | Frontend component | Backend endpoints | Database SQL |
| --------------------------------------------------- | ------------------ | ----------------- | ------------ |
| View home page                                      |    home.tsx        |       None        |    None      |
| Register new user<br/>(t@jwt.com, pw: test)         |     Login.tsx      |    authRouter.js  |INSERT INTO user (name, email, password) VALUES (?, ?, ?)|
| Login new user<br/>(t@jwt.com, pw: test)            |     Login.tsx      |   authRouter.js   |INSERT INTO auth (token, userId) VALUES (?, ?)|
| Order pizza                                         |     Menu.tsx       |  orderRouter.js   |INSERT INTO dinerOrder (dinerId, franchiseId, storeId, date) VALUES (?, ?, ?, now())|
| Verify pizza                                        |    Delivery.tsx    |  orderRouter.js   |SELECT id, franchiseId, storeId, date FROM dinerOrder WHERE dinerId=? LIMIT ${offset},${config.db.listPerPage}|
| View profile page                                   | dinerDashboard.tsx |   authRouter.js   |SELECT userId FROM auth WHERE token=?|
| View franchise<br/>(as diner)                       |FranchiseDashboard.tsx|franchiseRouter.js|SELECT id, name FROM franchise|
| Logout                                              |   logout.tsx       |      None         |    None      |
| View About page                                     |    about.tsx       |      None         |    None      |
| View History page                                   |     history.tsx    |      None         |    None      |
| Login as franchisee<br/>(f@jwt.com, pw: franchisee) |FranchiseDashboard.tsx|franchiseRouter.js|SELECT u.id, u.name, u.email FROM userRole AS ur JOIN user AS u ON u.id=ur.userId WHERE ur.objectId=? AND ur.role='franchisee'|
| View franchise<br/>(as franchisee)                  |FranchiseDashboard.tsx|franchiseRouter.js|SELECT objectId FROM userRole WHERE role='franchisee' AND userId=?|
| Create a store                                      |FranchiseDashboard.tsx|franchiseRouter.js|INSERT INTO store (franchiseId, name) VALUES (?, ?)|
| Close a store                                       |FranchiseDashboard.tsx|franchiseRouter.js|DELETE FROM store WHERE franchiseId=? AND id=?|
| Login as admin<br/>(a@jwt.com, pw: admin)           |     Login.tsx      |    authRouter.js  |INSERT INTO auth (token, userId) VALUES (?, ?)|
| View Admin page                                     |adminDashboard.jsx  |     None          |    None      |
| Create a franchise for t@jwt.com                    |FranchiseDashboard.tsx|franchiseRouter.js|SELECT id, name FROM user WHERE email=?|
| Close the franchise for t@jwt.com                   |FranchiseDashboard.tsx|franchiseRouter.js|DELETE FROM franchise WHERE id=?|
