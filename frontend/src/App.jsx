import React, { useState, useEffect } from 'react';
// Note: In this environment, we simulate multi-file components within the main App component.
// Using Tailwind CSS for minimal, attractive styling.

// ----------------------------------------------------------------
// Shared Utilities & State Management
// ----------------------------------------------------------------
const API_BASE_URL = 'http://localhost:3000/api';

// Use this mock user data/state to manage navigation and protected routes
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    // Initial check (in a real app, this would check localStorage/cookies)
    useEffect(() => {
        // You could try to load a saved token here if running outside the Canvas environment
    }, []);

    const login = (userData, jwtToken) => {
        setUser(userData);
        setToken(jwtToken);
        // localStorage.setItem('artique_token', jwtToken); 
        // localStorage.setItem('artique_user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        // localStorage.removeItem('artique_token');
        // localStorage.removeItem('artique_user');
    };

    return { user, token, login, logout };
};

// ----------------------------------------------------------------
// Components for the SPA (Single Page Application)
// ----------------------------------------------------------------

// 1. Navigation Component
const Navbar = ({ navigate, user, logout }) => (
    <nav className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-6">
                    <button onClick={() => navigate('home')} className="flex-shrink-0 text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors">
                        Artique
                    </button>
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                        <NavLink to="marketplace" navigate={navigate}>Marketplace</NavLink>
                        <NavLink to="courses" navigate={navigate}>Courses</NavLink>
                        {user && <NavLink to="dashboard" navigate={navigate}>Dashboard</NavLink>}
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <div className="flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-700">Hello, {user.username} ({user.role})</span>
                            <button onClick={logout} className="bg-red-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-red-600 transition-colors shadow">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <NavLink to="login" navigate={navigate}>Login</NavLink>
                            <button onClick={() => navigate('register')} className="bg-orange-500 text-white px-3 py-1 text-sm rounded-lg hover:bg-orange-600 transition-colors shadow">
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    </nav>
);

const NavLink = ({ to, navigate, children }) => (
    <button
        onClick={() => navigate(to)}
        className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-colors"
    >
        {children}
    </button>
);

// 2. Login Page Component
const LoginPage = ({ navigate, login }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (response.ok) {
                login(data.user, data.token);
                navigate('dashboard');
            } else {
                setError(data.message || 'Login failed. Check server status.');
            }
        } catch (err) {
            setError('Network error. Cannot connect to API.');
            console.error('Login error:', err);
        }
    };

    return (
        <AuthForm 
            title="User Login"
            fields={[
                { label: "Email", type: "email", value: email, onChange: setEmail },
                { label: "Password", type: "password", value: password, onChange: setPassword },
            ]}
            onSubmit={handleLogin}
            buttonText="Sign In"
            error={error}
            footerText="Don't have an account?"
            footerAction="Register"
            footerNavigate={() => navigate('register')}
        />
    );
};

// 3. Register Page Component
const RegisterPage = ({ navigate, login }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');

    const handleRegister = async () => {
        setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role }),
            });
            const data = await response.json();

            if (response.ok) {
                // Log the user in immediately after successful registration
                login(data.user, data.token);
                navigate('dashboard');
            } else {
                setError(data.message || 'Registration failed. Check if email is already used.');
            }
        } catch (err) {
            setError('Network error. Cannot connect to API.');
            console.error('Register error:', err);
        }
    };

    return (
        <AuthForm 
            title="Create an Account"
            fields={[
                { label: "Username", type: "text", value: username, onChange: setUsername },
                { label: "Email", type: "email", value: email, onChange: setEmail },
                { label: "Password", type: "password", value: password, onChange: setPassword },
            ]}
            selectField={{ 
                label: "Account Type", 
                value: role, 
                onChange: setRole,
                options: [{ value: 'user', label: 'Collector (User)' }, { value: 'artist', label: 'Artist (Creator)' }]
            }}
            onSubmit={handleRegister}
            buttonText="Register"
            error={error}
            footerText="Already have an account?"
            footerAction="Login"
            footerNavigate={() => navigate('login')}
        />
    );
};

// Reusable Auth Form structure
const AuthForm = ({ title, fields, selectField, onSubmit, buttonText, error, footerText, footerAction, footerNavigate }) => (
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">{title}</h2>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}

        <div className="space-y-4">
            {fields.map(({ label, type, value, onChange }, index) => (
                <div key={index}>
                    <label className="block text-sm font-medium text-gray-700">{label}</label>
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required
                    />
                </div>
            ))}
            {selectField && (
                <div>
                    <label className="block text-sm font-medium text-gray-700">{selectField.label}</label>
                    <select
                        value={selectField.value}
                        onChange={(e) => selectField.onChange(e.target.value)}
                        className="mt-1 w-full p-3 border border-gray-300 bg-white rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                        {selectField.options.map(option => (
                            <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
        
        <button
            onClick={onSubmit}
            className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-[1.01] shadow-lg"
        >
            {buttonText}
        </button>

        <p className="mt-4 text-center text-sm">
            {footerText} <button onClick={footerNavigate} className="text-blue-600 hover:text-blue-800 font-medium">{footerAction}</button>
        </p>
    </div>
);


// 4. Main Marketplace Component (CRUD demonstration)
const MarketplacePage = ({ user, token }) => {
    const [items, setItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false); // New state to check if modal is for editing
    const [currentItem, setCurrentItem] = useState({ id: null, name: '', description: '', price: '' }); // Item being edited/posted
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchItems = async () => {
        setMessage(''); setError('');
        try {
            const response = await fetch(`${API_BASE_URL}/items`);
            if (!response.ok) throw new Error('Failed to fetch items from API.');
            const data = await response.json();
            setItems(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleCreateOrUpdateItem = async () => {
        setMessage(''); setError('');
        if (!user || user.role !== 'artist') { setError('Only artists can modify listings.'); return; }
        if (!currentItem.name || !currentItem.description || !currentItem.price) { setError('All fields are required.'); return; }

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE_URL}/items/${currentItem.id}` : `${API_BASE_URL}/items`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({
                    name: currentItem.name, 
                    description: currentItem.description, 
                    price: parseFloat(currentItem.price), 
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                 throw new Error(data.message || `${method === 'PUT' ? 'Update' : 'Post'} failed.`);
            }
            
            setMessage(`Item ${isEditing ? 'updated' : 'posted'} successfully!`);
            closeModal();
            fetchItems(); // Refresh the list
        } catch (err) {
            setError(err.message);
            console.error(`${method} error:`, err);
        }
    };

    const handlePostButtonClick = () => {
        setIsEditing(false);
        setCurrentItem({ id: null, name: '', description: '', price: '' });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setCurrentItem({ id: null, name: '', description: '', price: '' });
    };

    // Function to handle Delete operation (D in CRUD)
    const handleDeleteItem = async (itemId) => {
        setMessage(''); setError('');
        if (!user || user.role !== 'artist' || !token) { 
            setError('Unauthorized action.'); 
            return; 
        }

        try {
            const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 204) {
                setMessage('Item deleted successfully!');
                fetchItems(); // Refresh the list
            } else {
                 const data = await response.json();
                 throw new Error(data.message || 'Failed to delete item.');
            }
        } catch (err) {
            setError(err.message);
            console.error('Delete error:', err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleAction = (action, itemId) => {
        const itemToActOn = items.find(item => item.id === itemId);
        if (!itemToActOn) return;

        switch (action) {
            case 'View':
                setMessage(`Viewing details for Item ID ${itemId}: ${itemToActOn.name}`);
                break;
            case 'Edit':
                // Pre-populate the modal with the item data
                setIsEditing(true);
                setCurrentItem({ 
                    id: itemToActOn.id, 
                    name: itemToActOn.name, 
                    description: itemToActOn.description, 
                    price: itemToActOn.price,
                });
                setShowModal(true);
                break;
            case 'Delete':
                // We use a custom modal or confirmation component in a full React app, 
                // but for this single-file environment, we use standard window.confirm.
                if (window.confirm(`Are you sure you want to delete Item ID ${itemId}: ${itemToActOn.name}?`)) {
                    handleDeleteItem(itemId);
                }
                break;
            default:
                setMessage(`Action: ${action} on ID ${itemId}.`);
        }
    };

    // Helper to sync local state with input changes
    const handleModalInputChange = (e) => {
        const { name, value } = e.target;
        setCurrentItem(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Artique Marketplace</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">{error}</div>}
            {message && <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4 text-sm font-medium">{message}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {items.length === 0 ? (
                    <p className="text-gray-500 col-span-full text-center">No unique art listings found. Be the first to post!</p>
                ) : (
                    items.map(item => (
                        <ItemCard key={item.id} item={item} user={user} handleAction={handleAction} />
                    ))
                )}
            </div>

            {user?.role === 'artist' && (
                <button 
                    onClick={handlePostButtonClick} 
                    className="fixed bottom-8 right-8 bg-orange-500 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:w-28 hover:pr-4 group hover:bg-orange-600"
                >
                    <i className="fas fa-plus transition-transform group-hover:rotate-90"></i>
                    <span className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:ml-4 text-sm font-medium">Post</span>
                </button>
            )}

            {/* Post/Edit Item Modal */}
            {showModal && (
                <Modal 
                    title={isEditing ? "Edit Artwork" : "Post New Artwork"} 
                    onClose={closeModal} 
                    onSubmit={handleCreateOrUpdateItem}
                    buttonText={isEditing ? "Save Changes" : "Post Item"}
                >
                    <input 
                        type="text" 
                        name="name"
                        placeholder="Item Name" 
                        value={currentItem.name} 
                        onChange={handleModalInputChange} 
                        className="w-full p-3 border rounded-lg mb-3" 
                    />
                    <textarea 
                        name="description"
                        placeholder="Description" 
                        value={currentItem.description} 
                        onChange={handleModalInputChange} 
                        className="w-full p-3 border rounded-lg mb-3" 
                        rows="3"
                    ></textarea>
                    <input 
                        type="number" 
                        name="price"
                        placeholder="Price (e.g., 450.00)" 
                        value={currentItem.price} 
                        onChange={handleModalInputChange} 
                        className="w-full p-3 border rounded-lg mb-3" 
                    />
                </Modal>
            )}
        </div>
    );
};

// Item Card for Marketplace (with Hover effects)
const ItemCard = ({ item, user, handleAction }) => {
    // Only show full CRUD icons if the logged-in user is the artist who posted the item
    const showControls = user && user.role === 'artist' && item.artist_id && parseInt(user.id) === parseInt(item.artist_id); // Added parseInt for comparison safety

    return (
        <div className="item-card relative bg-white p-6 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300 group">
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.name}</h3>
            <p className="mt-1 text-gray-600 line-clamp-2">{item.description}</p>
            <div className="mt-3 flex justify-between items-center">
                <span className="text-xl font-bold text-orange-600">₹{item.price ? parseFloat(item.price).toFixed(2) : 'N/A'}</span>
                <span className="text-sm text-gray-500">Artist ID: {item.artist_id}</span>
            </div>
            
            {/* Dynamic Icon Container (appears on hover) */}
            <div className="icon-container absolute top-4 right-4 flex space-x-3 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i onClick={() => handleAction('View', item.id)} className="fas fa-eye text-gray-500 cursor-pointer hover:text-blue-500 transition-colors"></i>
                {showControls && (
                    <>
                        <i onClick={() => handleAction('Edit', item.id)} className="fas fa-edit text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"></i>
                        <i onClick={() => handleAction('Delete', item.id)} className="fas fa-trash-alt text-red-500 cursor-pointer hover:text-red-700 transition-colors"></i>
                    </>
                )}
            </div>
        </div>
    );
};

// 5. Courses Page Component
const CoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [_error, _setError] = useState(''); // Silenced warnings for error state setter

    // NOTE: This will be properly implemented once the course CRUD backend is ready.
    useEffect(() => {
        // Mock data loading for now
        setCourses([
            { id: 1, title: 'Mastering Calligraphy: Beginner Strokes', instructor: 'Jane Doe', instrument: 'Ink and Pen', level: 'Beginner', price: 49.99 },
            { id: 2, title: 'Advanced Digital Sculpting', instructor: 'John Smith', instrument: 'ZBrush', level: 'Expert', price: 299.00 },
            { id: 3, title: 'Rhythmic Calisthenics: Fluid Movement', instructor: 'Aditya M.', instrument: 'Bodyweight', level: 'Intermediate', price: 75.00 },
        ]);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Artique Learning Hub</h2>
            {_error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm font-medium">{_error}</div>}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white p-6 rounded-xl shadow-lg border border-indigo-100 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-indigo-700">{course.title}</h3>
                        <p className="mt-2 text-gray-600">{course.instrument} - {course.level}</p>
                        <p className="text-sm text-gray-500">Instructor: {course.instructor}</p>
                        <div className="mt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">₹{course.price.toFixed(2)}</span>
                            <button className="bg-indigo-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors">Enroll Now</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// 6. Dashboard Component (for authenticated users/artists)
const DashboardPage = ({ user }) => (
    <div className="p-8 max-w-7xl mx-auto min-h-[50vh]">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">User Dashboard</h2>
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <h3 className="text-2xl font-semibold text-green-700 mb-4">Welcome Back, {user.username}!</h3>
            <p className="text-gray-600">Your User ID: <span className="font-mono text-sm bg-gray-100 p-1 rounded">{user.id}</span></p>
            <p className="text-gray-600">Your role: <span className="font-bold text-purple-700">{user.role}</span></p>
            
            {user.role === 'artist' ? (
                <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <h4 className="font-semibold text-yellow-800">Artist Portal:</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                        <li>You can now **Post Items** on the Marketplace page.</li>
                        <li>You can **Edit and Delete** only your own listings.</li>
                        <li>(Future: Manage your uploaded courses here).</li>
                    </ul>
                </div>
            ) : (
                 <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800">Collector Dashboard:</h4>
                    <ul className="list-disc list-inside text-gray-700 ml-4">
                        <li>(Future: Track your favorite art pieces).</li>
                        <li>(Future: View your enrolled courses).</li>
                    </ul>
                </div>
            )}
        </div>
    </div>
);

// 7. General Modal Component
// Added buttonText prop to support dynamic button text (Save Changes/Post Item)
const Modal = ({ title, children, onClose, onSubmit, buttonText }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full transform transition-all scale-100">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-gray-800">{title}</h3>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                    <i className="fas fa-times"></i>
                </button>
            </div>
            {children}
            <button onClick={onSubmit} className="w-full mt-4 bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors">
                {buttonText}
            </button>
        </div>
    </div>
);

// ----------------------------------------------------------------
// Main App Component (Single File Mandate)
// ----------------------------------------------------------------
const App = () => {
    const { user, token, login, logout } = useAuth();
    const [page, setPage] = useState('home');

    const navigate = (newPage) => {
        setPage(newPage);
    };

    // Protect routes based on authentication status
    useEffect(() => {
        if (page === 'dashboard' && !user) {
            navigate('login');
        }
    }, [page, user]);

    // Silencing the warning by prefixing the variable with an underscore
    const _closeModal = () => { 
         // Clear form inputs when closing modal
        const nameInput = document.getElementById('name');
        const descriptionInput = document.getElementById('description');
        if (nameInput) nameInput.value = '';
        if (descriptionInput) descriptionInput.value = '';
        
        const marketplacePage = document.querySelector('.p-8.max-w-7xl.mx-auto');
        if (marketplacePage) {
            // Re-render the MarketplacePage by changing its key state
            // This is handled by the setShowModal(false) call in MarketplacePage
        }
    };
    

    const renderPage = () => {
        switch (page) {
            case 'login':
                return <LoginPage navigate={navigate} login={login} />;
            case 'register':
                return <RegisterPage navigate={navigate} login={login} />;
            case 'marketplace':
                // Pass token down to MarketplacePage for authenticated actions
                return <MarketplacePage user={user} token={token} />; 
            case 'courses':
                return <CoursesPage />;
            case 'dashboard':
                if (user) return <DashboardPage user={user} />;
                break;
            case 'home':
                return (
                    <div className="p-8 max-w-7xl mx-auto text-center min-h-[70vh] flex flex-col justify-center items-center">
                        <i className="fas fa-palette text-6xl text-orange-500 mb-6"></i>
                        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Welcome to Artique</h2>
                        <p className="text-lg text-gray-600 max-w-md">The scalable platform for unique art and creative education. Navigate above to explore the Marketplace or log in to access your tools.</p>
                        <div className="mt-8 space-x-4">
                            <button onClick={() => navigate('marketplace')} className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors shadow-lg">Explore Marketplace</button>
                            {!user && (
                                <button onClick={() => navigate('register')} className="bg-orange-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors shadow-lg">Join Artique</button>
                            )}
                        </div>
                    </div>
                );
            default:
                // Fallthrough protection
                return (
                    <div className="p-8 text-center">
                        <h2 className="text-red-600 text-2xl">404 - Page Not Found</h2>
                        <button onClick={() => navigate('home')} className="text-blue-500 mt-2">Go Home</button>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Navbar navigate={navigate} user={user} logout={logout} />
            <main className="pt-4">
                {renderPage()}
            </main>
        </div>
    );
};

export default App;
