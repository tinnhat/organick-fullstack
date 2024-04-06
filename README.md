# Organick Food Shop
Organick is shop selling about organick food like: vegetable, fruit,.... and that includes a user interface and an admin management interface
# Deploy
- [https://organick-fullstack.vercel.app/](https://organick-fullstack.vercel.app/home)
## Reference UI:
- [https://organick-template.webflow.io/](https://organick-template.webflow.io/)
## Technical
## Front-end:
- NextJS, Typescript, Martial UI(MUI), HTML/CSS(SCSS), Stripe, React-query
## Back-end:
- Typescript, ExpressJS, Cloudinary(Image)
- Database: MongoBD
## Feature:
+ Login/Signup (Remember login)
+ Authentication with Next Auth
+ Update Infomation and Avatar
+ Forgot password
+ Upload avatar/image (use cloudinary to storage)
+ Send email when forgot password and confirm account when register
+ User Management(create, edit, delete)
+ Product Management(create, edit, delete)
+ Order Management(create, edit, delete)
+ Category Management(create, edit, delete)
+ Pagination for admin table and search in any page
+ Add product to card ( includes check quantity in stock)
+ Filter Product (star, category, DESC or ASC, search by name)
+ History Order and Order detail, Pagination and fitler by status of order
+ Checkout order by using Stripe
+ Using webhook of Stripe to catch action when user checkout
+ Sitemap and robot for SEO
+ Export data by filter or not filter in admin pages
+ Support Responsive
## Usage
For FE:
Run in local.
```bash
cd FE
npm install
npm run dev
```
For BE:
```bash
cd BE
npm install
npm run dev
```
Note: 
+ Credit card in checkout infomation: 4242 4242 4242 4242
+ Account Admin: admin@gmail.com/123456789
## API Information
- [https://www.postman.com/crimson-zodiac-919695/workspace/organick/overview](https://www.postman.com/crimson-zodiac-919695/workspace/organick/overview)
### License
This project is for study purposes, not for commercial purposes. If there are any problems, please contact via email: tinnhat0412@gmail.com
