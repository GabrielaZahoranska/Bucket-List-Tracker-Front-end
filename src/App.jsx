import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import * as bucketItemService from './services/bucketItemService';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import BucketList from './pages/BucketList';
import BucketItemDetail from './pages/BucketItemDetail';

function AppContent() {
  const { user } = useAuth();
  const [bucketItems, setBucketItems] = useState([]);

  useEffect(() => {
    const fetchAllBucketItems = async () => {
      const data = await bucketItemService.index();
      setBucketItems(data);
    };
    if (user) fetchAllBucketItems();
  }, [user]);

  const handleAddBucketItem = async (bucketItemFormData) => {
    const newItem = await bucketItemService.create(bucketItemFormData);
    setBucketItems([newItem, ...bucketItems]);
  };

  const handleUpdateBucketItem = async (bucketItemId, bucketItemFormData) => {
    const updated = await bucketItemService.update(bucketItemId, bucketItemFormData);
    setBucketItems(bucketItems.map((item) => (item._id === bucketItemId ? updated : item)));
  };

  const handleDeleteBucketItem = async (bucketItemId) => {
    await bucketItemService.deleteBucketItem(bucketItemId);
    setBucketItems(bucketItems.filter((item) => item._id !== bucketItemId));
  };

  return (
    <Routes>
      <Route path="/" element={user ? <Layout><Dashboard /></Layout> : <Home />} />
      {user ? (
        <>
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route
            path="/goals"
            element={
              <Layout>
                <BucketList
                  bucketItems={bucketItems}
                  handleAddBucketItem={handleAddBucketItem}
                  handleUpdateBucketItem={handleUpdateBucketItem}
                  handleDeleteBucketItem={handleDeleteBucketItem}
                />
              </Layout>
            }
          />
          <Route path="/goals/:id" element={<Layout><BucketItemDetail /></Layout>} />
        </>
      ) : (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </>
      )}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
