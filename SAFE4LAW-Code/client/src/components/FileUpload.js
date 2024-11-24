//FileUpload.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaCloudUploadAlt, FaFileAlt, FaImage, FaKey, FaClock, FaUsers } from 'react-icons/fa';

const FileUpload = () => {
  const navigate = useNavigate();
  const [fileDoc, setFileDoc] = useState(null);
  const [fileImage, setFileImage] = useState(null);
  const [user, setUser] = useState(''); // To store selected user
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users',{
          headers:{
             'Accept': 'application/json',
              'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
          
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Oops, we haven't got JSON!");
        }

        const userData = await response.json();
        setUsers(userData);



         
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 50 * 1024 * 1024) {
      setFileDoc(file);
    } else {
      alert('File size exceeds 50MB limit');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setFileImage(file);
    } else {
      alert('File size exceeds 5MB limit');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please select a user!');
      return;
    }
    if (!fileDoc || !fileImage) {
      alert('Please upload both the file and the image!');
      return;
    }

    // Prepare FormData for uploading
    const formData = new FormData();
    formData.append('document', fileDoc);
    formData.append('image', fileImage);
    formData.append('userId', user);

    try {
      const response = await fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Files uploaded successfully');
      } else {
        console.error('Error uploading files');
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Error fetching users:', errorData);
      } else {
        const userData = await response.json();
        setUsers(userData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#7ED7C6] to-[#5fb3a5]">
      {/* Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-sm fixed w-full top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold">
                <span className="text-[#006B5E]">SAFE4</span>
                <span className="text-black">LAW</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/service" className="text-gray-800 font-extrabold hover:text-[#006B5E] transition-colors">
                Service
              </Link>
              <Link to="/about" className="text-gray-800 hover:text-[#006B5E] font-semibold transition-colors">
                About us
              </Link>
              <Link className="bg-[#F15A22] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d14d1d] transition-all transform hover:scale-105">
                Sign out
              </Link>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[#006B5E] transition-colors"
                   onClick={() => navigate('/updateprofile')}>
                <FaUserCircle className="text-blue-800 text-3xl" />
                <span className="text-gray-800 font-semibold">{ }</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto pt-24 px-4">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
          <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <FaCloudUploadAlt className="mx-auto text-6xl text-teal-600 mb-4" />
              <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
                FILE UPLOAD
              </h2>
              <div className="h-1 w-32 bg-teal-600 mx-auto"></div>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              {/* Select User */}
              <div className="form-group">
                <label htmlFor="user" className="flex items-center text-xl font-bold text-gray-700 mb-2">
                  <FaUsers className="mr-2 text-teal-600" />
                  Select User <span className="text-red-500 ml-1">*</span>
                </label>
                <select 
                id="user"
                  required 
                  value={user} 
                  onChange={(e) => setUser(e.target.value)} 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                >
                  <option value="">Select a user</option>
                  {users.map((u) => (
                    <option key={u._id} value={u._id}>
                      {u.firstName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload File */}
              <div className="form-group">
                <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
                  <FaFileAlt className="mr-2 text-teal-600" />
                  Upload File <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleDocChange} 
                    accept=".pdf,.doc" 
                    className="hidden" 
                    id="fileDoc" 
                    required 
                  />
                  <div className="flex items-center">
                    <label htmlFor="fileDoc" className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                      {fileDoc ? fileDoc.name : 'Choose file'}
                    </label>
                    {fileDoc && (
                      <button onClick={() => setFileDoc(null)} className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors">
                        ×
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">PDF, DOC - 50MB limit</p>
                </div>
              </div>

              {/* Upload Image */}
              <div className="form-group">
                <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
                  <FaImage className="mr-2 text-teal-600" />
                  Upload Image <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={handleImageChange} 
                    accept=".jpeg,.jpg" 
                    className="hidden" 
                    id="fileImage" 
                    required 
                  />
                  <div className="flex items-center">
                    <label htmlFor="fileImage" className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
                      {fileImage ? fileImage.name : 'Choose file'}
                    </label>
                    {fileImage && (
                      <button onClick={() => setFileImage(null)} className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors">
                        ×
                      </button>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">PNG - 5MB limit</p>
                </div>
              </div>

              {/* Enter Key */}
              <div className="form-group">
                <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
                  <FaKey className="mr-2 text-teal-600" />
                  Enter Key <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                />
              </div>

              {/* File Access */}
              <div className="form-group">
                <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
                  <FaUsers className="mr-2 text-teal-600" />
                  File Access <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="text" 
                  required 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                />
              </div>

              {/* Expiration Time */}
              <div className="form-group">
                <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
                  <FaClock className="mr-2 text-teal-600" />
                  Expiration Time <span className="text-red-500 ml-1">*</span>
                </label>
                <input 
                  type="datetime-local" 
                  required 
                  className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" 
                />
              </div>

              {/* Submit Button */}
              <div className="text-center">
                <button type="submit" className="bg-teal-600 text-white px-8 py-3 rounded-lg text-xl font-semibold hover:bg-teal-700 transition-all transform hover:scale-105">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;



// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { FaUserCircle, FaCloudUploadAlt, FaFileAlt, FaImage, FaKey, FaClock, FaUsers } from 'react-icons/fa';

// const FileUpload = () => {
//   const navigate = useNavigate();
//   const [fileDoc, setFileDoc] = useState(null);
//   const [fileImage, setFileImage] = useState(null);

//   const handleDocChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= 50 * 1024 * 1024) {
//       setFileDoc(file);
//     } else {
//       alert('File size exceeds 50MB limit');
//     }
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file && file.size <= 5 * 1024 * 1024) {
//       setFileImage(file);
//     } else {
//       alert('File size exceeds 5MB limit');
//     }
//   };

//   const handleUpload = (e) => {
//     e.preventDefault();
//     console.log('Uploading files...');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-[#7ED7C6] to-[#5fb3a5]">
//       {/* Navigation Bar */}
//       <nav className="bg-white/90 backdrop-blur-sm fixed w-full top-0 z-50 shadow-md">
//         <div className="container mx-auto px-4 py-3">
//           <div className="flex justify-between items-center">
//             <div className="flex items-center">
//               <h1 className="text-3xl font-bold">
//                 <span className="text-[#006B5E]">SAFE4</span>
//                 <span className="text-black">LAW</span>
//               </h1>
//             </div>

//             <div className="hidden md:flex items-center space-x-8">
//               <Link to="/service" className="text-gray-800 font-extrabold hover:text-[#006B5E] transition-colors">
//                 Service
//               </Link>
//               <Link to="/about" className="text-gray-800 hover:text-[#006B5E] font-semibold transition-colors">
//                 About us
//               </Link>
//               <Link className="bg-[#F15A22] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#d14d1d] transition-all transform hover:scale-105">
//                 Sign out
//               </Link>
//               <div className="flex items-center space-x-2 cursor-pointer hover:text-[#006B5E] transition-colors"
//                    onClick={() => navigate('/updateprofile')}>
//                 <FaUserCircle className="text-blue-800 text-3xl" />
//                 <span className="text-gray-800 font-semibold">{ }</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="container mx-auto pt-24 px-4">
//         <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
//           <div className="w-full max-w-2xl bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8">
//             <div className="text-center mb-8">
//               <FaCloudUploadAlt className="mx-auto text-6xl text-teal-600 mb-4" />
//               <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
//                 FILE UPLOAD
//               </h2>
//               <div className="h-1 w-32 bg-teal-600 mx-auto"></div>
//             </div>

//             <form onSubmit={handleUpload} className="space-y-6">
//               {/* Select User */}
//               <div className="form-group">
//                 <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
//                   <FaUsers className="mr-2 text-teal-600" />
//                   Select User <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <select required className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all">
//                   <option value="">Select a user</option>
//                   <option value="user1">User 1</option>
//                   <option value="user2">User 2</option>
//                 </select>
//               </div>

//               {/* Upload File */}
//               <div className="form-group">
//                 <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
//                   <FaFileAlt className="mr-2 text-teal-600" />
//                   Upload File <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <input type="file" onChange={handleDocChange} accept=".pdf,.doc" className="hidden" id="fileDoc" required />
//                   <div className="flex items-center">
//                     <label htmlFor="fileDoc" className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
//                       {fileDoc ? fileDoc.name : 'Choose file'}
//                     </label>
//                     {fileDoc && (
//                       <button onClick={() => setFileDoc(null)} className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors">
//                         ×
//                       </button>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">PDF, DOC - 50MB limit</p>
//                 </div>
//               </div>

//               {/* Upload Image */}
//               <div className="form-group">
//                 <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
//                   <FaImage className="mr-2 text-teal-600" />
//                   Upload Image <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <div className="relative">
//                   <input type="file" onChange={handleImageChange} accept=".jpeg,.jpg" className="hidden" id="fileImage" required />
//                   <div className="flex items-center">
//                     <label htmlFor="fileImage" className="flex-1 p-3 rounded-lg bg-gray-50 border border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
//                       {fileImage ? fileImage.name : 'Choose file'}
//                     </label>
//                     {fileImage && (
//                       <button onClick={() => setFileImage(null)} className="ml-2 p-2 text-gray-500 hover:text-red-500 transition-colors">
//                         ×
//                       </button>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-600 mt-1">PNG - 5MB limit</p>
//                 </div>
//               </div>

//               {/* Enter Key */}
//               <div className="form-group">
//                 <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
//                   <FaKey className="mr-2 text-teal-600" />
//                   Enter Key <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <input type="text" required className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
//               </div>

//               {/* File Access */}
//               <div className="form-group">
//                 <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
//                   <FaUsers className="mr-2 text-teal-600" />
//                   File Access <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <input type="text" required className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
//               </div>

//               {/* Expiration Time */}
//               <div className="form-group">
//                 <label className="flex items-center text-xl font-bold text-gray-700 mb-2">
//                   <FaClock className="mr-2 text-teal-600" />
//                   Expiration Time <span className="text-red-500 ml-1">*</span>
//                 </label>
//                 <input type="datetime-local" required className="w-full p-3 rounded-lg bg-gray-50 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all" />
//               </div>

//               {/* Upload Button */}
//               <div className="flex justify-center mt-8">
//                 <button type="submit" className="group bg-teal-600 text-white px-12 py-3 rounded-full text-xl font-bold hover:bg-teal-700 transform hover:scale-105 transition-all flex items-center">
//                   <FaCloudUploadAlt className="mr-2 group-hover:animate-bounce" />
//                   UPLOAD
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FileUpload;