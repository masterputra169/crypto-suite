# Crypto Suite Learning Platform

A comprehensive interactive web application for learning and experimenting with various cryptographic algorithms and ciphers.

## Project Overview

Crypto Suite is an educational platform that provides hands-on experience with classical and modern cryptographic techniques. The application features interactive visualizations, real-time encryption/decryption, and performance analytics for multiple cipher algorithms.

## Architecture

### Frontend
- **Framework**: React 19.2.0 with Vite 7.2.4
- **Styling**: TailwindCSS 4.1.17
- **Routing**: React Router DOM 7.10.1
- **Charts**: Chart.js 4.5.1 with react-chartjs-2
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js 4.18.2
- **Database**: MySQL (via mysql2)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Email**: Nodemailer
- **Security**: Helmet, CORS
- **Validation**: express-validator

## Project Structure

```
crypto-suite/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── atoms/          # Basic UI components (Button, Input, Card, etc.)
│   │   │   ├── molecules/      # Composite components (InputField, ModeToggle, etc.)
│   │   │   ├── organisms/      # Complex components (Sidebar, Header, CipherPanel)
│   │   │   ├── templates/      # Layout templates
│   │   │   └── visualizations/ # Cipher-specific visualizations
│   │   ├── pages/
│   │   │   ├── auth/           # Authentication pages
│   │   │   ├── substitution/   # Substitution cipher pages
│   │   │   ├── polygram/       # Polygram cipher pages
│   │   │   ├── transposition/  # Transposition cipher pages
│   │   │   ├── advanced/       # Advanced cipher pages
│   │   │   ├── stream/         # Stream cipher pages
│   │   │   └── modern/         # Modern cipher pages (DES, RSA)
│   │   ├── context/            # React Context providers
│   │   └── App.jsx             # Main application component
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/             # Database and environment configuration
│   │   ├── controllers/        # Request handlers
│   │   ├── middlewares/        # Authentication, validation, error handling
│   │   ├── models/             # Database models
│   │   ├── routes/             # API routes
│   │   └── utils/              # Helper functions
│   ├── server.js
│   └── package.json
└── CLAUDE.md
```

## Implemented Cipher Categories

### 1. Substitution Ciphers
- **Caesar Cipher**: Classic shift cipher with configurable offset
- **Vigenere Cipher**: Polyalphabetic substitution using keyword
- **Beaufort Cipher**: Reciprocal cipher variant of Vigenere
- **Autokey Cipher**: Self-synchronizing cipher using plaintext as key

### 2. Polygram Ciphers
- **Playfair Cipher**: Digraph substitution cipher with 5×5 key square
- **Hill Cipher**: Matrix-based polygraphic substitution

### 3. Transposition Ciphers
- **Rail Fence Cipher**: Write-and-read pattern transposition
- **Columnar Transposition**: Column-based message rearrangement
- **Myszkowski Transposition**: Columnar variant with duplicate key letters
- **Double Transposition**: Two-stage transposition for enhanced security

### 4. Advanced Ciphers
- **Super Encryption**: Combination of multiple cipher techniques
- **OTP (One-Time Pad)**: Theoretically unbreakable encryption

### 5. Stream Ciphers
- **LCG (Linear Congruential Generator)**: Pseudorandom number generator-based cipher
- **BBS (Blum Blum Shub)**: Cryptographically secure PRNG

### 6. Modern Ciphers
- **DES-ECB**: Data Encryption Standard in Electronic Codebook mode
- **DES-CBC**: Data Encryption Standard in Cipher Block Chaining mode
- **RSA**: Asymmetric public-key cryptosystem

## Key Features

### User Experience
- Dark/Light theme toggle with persistent preferences
- Responsive design with collapsible sidebar navigation
- Real-time encryption/decryption processing
- Interactive cipher visualizations
- Performance metrics and statistics tracking
- User authentication and profile management

### Authentication System
- User registration with email verification
- Secure login with JWT tokens
- Password reset functionality
- Protected routes for authenticated users
- Session management

### Cipher Interface
Each cipher page typically includes:
- Mode toggle (Encrypt/Decrypt)
- Input text area
- Key/parameter configuration
- Visual algorithm representation
- Result display with copy functionality
- Performance statistics
- Algorithm explanation

### Visualization Components
- **CaesarViz**: Alphabet shift visualization
- **VigenereViz**: Polyalphabetic table display
- **PlayfairGrid**: 5×5 key square matrix
- **HillMatrixViz**: Matrix operations visualization
- **RailFenceViz**: Zigzag pattern display
- **ColumnarViz**: Column arrangement visualization
- **DESViz**: DES round functions and transformations
- **RSAViz**: Public/private key generation visualization
- **OTPViz**: One-time pad operation display
- **StreamCipherViz**: PRNG state visualization
- **SuperEncryptionViz**: Multi-stage encryption flow

## Development Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Backend Setup
```bash
cd backend
npm install

# Copy environment template
cp .env.example .env

# Configure database connection in .env
# Run database migrations
npm run migrate

# Start development server
npm run dev
```

### Environment Variables

**Backend (.env):**
```
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=crypto_suite
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:3000/api
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `PUT /api/user/change-password` - Change user password

### Cipher Operations
- `POST /api/cipher/*` - Cipher-specific encryption/decryption endpoints

## Component Architecture

### Atomic Design Pattern
The frontend follows atomic design principles:

1. **Atoms**: Basic building blocks (Button, Input, Label, Badge, Card)
2. **Molecules**: Simple component groups (InputField, KeyInput, ModeToggle)
3. **Organisms**: Complex UI sections (Sidebar, Header, CipherPanel, StatisticsPanel)
4. **Templates**: Page layouts (MainLayout, CipherLayout)
5. **Pages**: Complete views with business logic

### Context Providers
- **AuthContext**: User authentication state and methods
- **CipherContext**: Cipher operations and state management
- **StatisticsContext**: Usage statistics and performance tracking

## Security Considerations

- Password hashing with bcryptjs
- JWT-based authentication with secure token storage
- Protected routes requiring authentication
- Input validation and sanitization
- CORS configuration
- Helmet.js security headers
- SQL injection prevention via parameterized queries
- XSS protection

## Educational Value

This platform serves as:
- Interactive learning tool for cryptography students
- Hands-on cipher implementation reference
- Visual demonstration of encryption algorithms
- Performance comparison between different ciphers
- Historical perspective on classical cryptography
- Introduction to modern cryptographic systems

## Performance Tracking

The application tracks:
- Encryption/decryption execution time
- Number of operations performed
- User engagement metrics
- Cipher usage statistics
- Performance comparison charts

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Future Enhancements

Potential additions:
- Additional cipher algorithms (AES, Blowfish, Twofish)
- Cryptanalysis tools and frequency analysis
- Cipher strength comparison
- Educational tutorials and guided lessons
- Collaborative cipher challenges
- Mobile application
- Offline mode support
- Export/import functionality for cipher history

## Contributing

When contributing to this project:
1. Follow the established component structure
2. Maintain atomic design patterns
3. Add appropriate visualizations for new ciphers
4. Include algorithm documentation
5. Update tests for new features
6. Ensure responsive design compatibility

## License

MIT License

## Author

Master

## Version

1.0.0

---

**Note**: This is an educational platform. While the implementations are functional, they should not be used for actual secure communications. Modern production systems should use established cryptographic libraries and standards.
