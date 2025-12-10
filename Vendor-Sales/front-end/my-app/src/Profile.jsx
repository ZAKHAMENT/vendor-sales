import React, { useState, useEffect } from "react";
import styles from './Profile.module.css';
import { useParams, Link } from "react-router-dom";
import axios from 'axios';

function Profile() {
  const {section} = useParams();
  const [basicInfo, setBasicInfo] = useState({
    shopName: "", ownerName: "", gender: "", streetAddress: "", district: "", state: "", pincode: "", email: "", phoneNo: "", instagram: "" })
  const [isEditInfo, setIsEditInfo] = useState({
    shopName: false, ownerName: false, gender: false, streetAddress: false, district: false, state: false, pincode: false, email: false, phoneNo: false, instagram: false, 
  });

  const handleSaveChanges = async (changedDataName) => {
    let changedData = basicInfo[changedDataName];
    console.log(changedData);
    
    try {
    const response = await axios.post("http://localhost:3000/change-user-info",{changedDataName, changedData}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })
    console.log(response);
    
    } catch (error) {
      console.log("Error logging in:", error);
    }
  }


  console.log(basicInfo);
  return (
    <>
    <div className={styles.profileContainer}>
      <div className={styles.profileImageContainer}>
        <img className={styles.profileImg} src="/images/vendor.png" alt="" />
        <div>
        <h2 className={styles.profileName}>John Doe</h2>
        <h6 className={styles.ownerId}>VendiSales ID:343498</h6>
                </div>
      </div>
      {/* Basic Information */}
          <div className={styles.personalInfo}>
            {!section && (
              <>
      <h3 className={styles.sectionTitle}>Basic Information</h3>
          <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Shop Name:</span>
        <span className={styles.infoValue}>
          {isEditInfo.shopName ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.shopName} onChange={(e) => setBasicInfo({...basicInfo, shopName: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, shopName: false}), handleSaveChanges("shopName")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.shopName ? basicInfo.shopName : <span className={styles.infoPlaceholder}> Your Shop Name</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, shopName: true}) }>Edit</span></span>
    </div>
                  <span className={styles.line}></span>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Owner Name:</span>
        <span className={styles.infoValue}>
          {isEditInfo.ownerName ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.ownerName} onChange={(e) => setBasicInfo({...basicInfo, ownerName: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, ownerName: false}), handleSaveChanges("ownerName")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.ownerName ? basicInfo.ownerName : <span className={styles.infoPlaceholder}> Your Owner Name</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, ownerName: true})}>Edit</span></span>
    </div>
            <span className={styles.line}></span>

          <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Gender:</span>
        <span className={styles.infoValue}>
          {isEditInfo.gender ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.gender} onChange={(e) => setBasicInfo({...basicInfo, gender: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, gender: false}), handleSaveChanges("gender")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.gender ? basicInfo.gender : <span className={styles.infoPlaceholder}> Your Gender</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, gender: true})}>Edit</span></span>
        </div>
            <span className={styles.line}></span>
          <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Street Address</span>
        <span className={styles.infoValue}>
          {isEditInfo.streetAddress ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.streetAddress} onChange={(e) => setBasicInfo({...basicInfo, streetAddress: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, streetAddress: false}), handleSaveChanges("streetAddress")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.streetAddress ? basicInfo.streetAddress : <span className={styles.infoPlaceholder}> Your Street Address</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, streetAddress: true})}>Edit</span></span>
        </div>
      <span className={styles.line}></span>
          <div className={styles.infoItem}>
        <span className={styles.infoLabel}>District</span>
        <span className={styles.infoValue}>
          {isEditInfo.district ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.district} onChange={(e) => setBasicInfo({...basicInfo, district: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, district: false}), handleSaveChanges("district")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.district ? basicInfo.district : <span className={styles.infoPlaceholder}> Your District</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, district: true})}>Edit</span></span>
        </div>
      <span className={styles.line}></span>
                <div className={styles.infoItem}>
        <span className={styles.infoLabel}>State</span>
        <span className={styles.infoValue}>
          {isEditInfo.state ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.state} onChange={(e) => setBasicInfo({...basicInfo, state: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, state: false}), handleSaveChanges("state")]}>Save</button>
            </div>
          ) : (    
            <span>{basicInfo.state ? basicInfo.state : <span className={styles.infoPlaceholder}> Your State</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, state: true})}>Edit</span></span>
        </div>
      <span className={styles.line}></span>
              <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Pin Code</span>
        <span className={styles.infoValue}>
          {isEditInfo.pincode ? ( 
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.pincode} onChange={(e) => setBasicInfo({...basicInfo, pincode: e.target.value})} type="number" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, pincode: false}), handleSaveChanges("pincode")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.pincode ? basicInfo.pincode : <span className={styles.infoPlaceholder}> Your Pin Code</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, pincode: true})}>Edit</span></span>
        </div>
      <span className={styles.line}></span>
          </>
        )}
    {/* Contact Information */}
    {section === "contact-info" && (
          <>
      <h3 className={styles.sectionTitle}>Contact Information</h3>
          <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Email</span>
        <span className={styles.infoValue}>
          {isEditInfo.email ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.email} onChange={(e) => setBasicInfo({...basicInfo, email: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, email: false}), handleSaveChanges("email")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.email ? <span className={styles.infoPlaceholder}>{basicInfo.email}</span> : <span className={styles.infoPlaceholder}> Your Email</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, email: true})}>Edit</span></span>
          </div>
          <span className={styles.line}></span>
                    <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Phone No</span>
        <span className={styles.infoValue}>
          {isEditInfo.phoneNo ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.phoneNo} onChange={(e) => setBasicInfo({...basicInfo, phoneNo: e.target.value})} type="number" maxLength={10} />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, phoneNo: false}), handleSaveChanges("phoneNo")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.phoneNo ? <span className={styles.infoPlaceholder}>{basicInfo.phoneNo}</span> : <span className={styles.infoPlaceholder}> Your Phone Number</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, phoneNo: true})}>Edit</span></span>
          </div>
          <span className={styles.line}></span>
                    <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Instagram</span>
        <span className={styles.infoValue}>
          {isEditInfo.instagram ? (
            <div className={styles.editInputContainer}>
            <input className={styles.editInput} value={basicInfo.instagram} onChange={(e) => setBasicInfo({...basicInfo, instagram: e.target.value})} type="text" />
            <button className={styles.editSavebtn} onClick={() => [setIsEditInfo({...isEditInfo, instagram: false}), handleSaveChanges("instagram")]}>Save</button>
            </div>
          ) : (
            <span>{basicInfo.instagram ? <span className={styles.infoPlaceholder}>{basicInfo.instagram}</span> : <span className={styles.infoPlaceholder}> Your Instagram</span>}</span>
          )}
        </span>
        <span className={styles.span1}><span onClick={() => setIsEditInfo({...isEditInfo, instagram: true})}>Edit</span></span>
          </div>
          <span className={styles.line}></span>
    </>
        )}
    </div>

    </div>

<div className={styles.infoSection}>
<Link to="/profile" className={styles.info}>Basic Info</Link>
<Link to="/profile/contact-info" className={styles.info}>Contact Info</Link>
</div>
    </>
  )
}

export default Profile;
