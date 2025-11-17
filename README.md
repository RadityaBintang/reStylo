# 🎨 reStylo - Your Personal Style Assistant

![reStylo Banner](https://via.placeholder.com/800x200/000000/FFFFFF?text=reStylo+-+Find+Your+Perfect+Style)

reStylo is a smart fashion recommendation web application that helps you discover the perfect outfits based on your body type, weather conditions, and personal style preferences.

## ✨ Features

### 🎯 Smart Recommendations
- **Body Type Matching** - Get outfit suggestions based on your weight and height
- **Weather-Based Suggestions** - Receive appropriate clothing recommendations for current weather conditions
- **Style Categories** - Explore different fashion styles (Casual, Chic, College, Street, Sporty, Minimalist)

### 👕 Outfit Management
- **Mix & Match** - Create custom outfits by combining tops and bottoms
- **Save Favorites** - Build your personal outfit collection
- **Gender Filtering** - Get gender-specific recommendations (Male/Female/Unisex)

### 🌟 User Experience
- **Responsive Design** - Optimized for mobile devices (480px width)
- **User Authentication** - Secure login and registration system
- **Review System** - Share and read outfit reviews and ratings
- **Intuitive Interface** - Clean, modern design with smooth interactions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MySQL Database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/RadityaBintang/reStylo.git
cd reStylo
```

2. **Install dependencies**
```bash
npm install
```

3. **Database Setup**
```bash
# Import the database schema
mysql -u your_username -p < database.sql
```

4. **Environment Configuration**
Create a `.env` file in the root directory:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_DATABASE=stylematch
SECRET_KEY=your_jwt_secret_key
PORT=3000
```

5. **Start the application**
```bash
npm start
```

6. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database management
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

### Frontend
- **HTML5** - Markup
- **Tailwind CSS** - Styling framework
- **JavaScript (ES6+)** - Client-side functionality
- **Font Awesome** - Icons

### Architecture
- **MVC Pattern** - Model-View-Controller structure
- **RESTful API** - Backend API design
- **Middleware Authentication** - Secure route protection

## 📱 Application Structure

```
reStylo/
├── config/          # Database configuration
├── controllers/     # Business logic handlers
├── models/         # Data models and database queries
├── middlewares/    # Authentication middleware
├── routes/         # API route definitions
├── public/         # Frontend HTML pages
├── assets/         # Static files (images, etc.)
└── database.sql    # Database schema and sample data
```

## 🎨 Key Pages

### 🔐 Authentication
- **Login** (`/login.html`) - User authentication
- **Register** (`/register.html`) - New user registration

### 🏠 Main Interface
- **Dashboard** (`/main.html`) - Style category selection
- **Outfit Selection** (`/select_outfit.html`) - Mix and match outfits
- **Saved Outfits** (`/saved_outfits.html`) - Personal collection

### 🤖 Smart Features
- **Weather Recommendations** (`/weather.html`) - Weather-based suggestions
- **Body Type Recommendations** (`/weight.html`) - Size-based matching
- **Outfit Details** (`/recommendation_detail.html`) - Detailed outfit view
- **Reviews** (`/review.html`) - User feedback system

## 🔧 API Endpoints

### User Management
- `POST /api/users/login` - User authentication
- `POST /api/users/register` - User registration
- `POST /api/users/logout` - User logout

### Outfit Management
- `GET /api/outfit/tops/public` - Get available tops
- `GET /api/outfit/bottoms/public` - Get available bottoms
- `POST /api/outfit/save` - Save custom outfit
- `GET /api/outfit/saved` - Get saved outfits
- `DELETE /api/outfit/:id` - Delete saved outfit

### Recommendations
- `GET /api/recommendations` - Body type recommendations
- `GET /api/weather` - Weather-based recommendations
- `GET /api/recommendations/:id` - Outfit details

### Reviews
- `GET /api/reviews/:outfitId` - Get outfit reviews
- `POST /api/reviews` - Add new review

## 🎯 Usage Examples

### Finding Weather-Appropriate Outfits
1. Navigate to Weather section
2. Select current weather condition (Sunny, Cloudy, Rainy, Windy)
3. Enter temperature
4. Get personalized outfit recommendations

### Creating Custom Outfits
1. Go to Style Selection
2. Choose top and bottom items
3. Save your combination with custom name and description
4. Access anytime from Saved Outfits

### Body Type Matching
1. Enter your weight and height
2. Receive outfits optimized for your body measurements
3. Filter by style preferences

## 🤝 Contributing

We welcome contributions! Please feel free to submit pull requests or open issues for bugs and feature requests.

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Raditya Bintang** - Project Lead & Developer

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub or contact the development team.

---

<div align="center">

### ⭐ Star us on GitHub if you find this project helpful!

**Find your style. Express yourself. Be reStylo.** ✨

</div>
