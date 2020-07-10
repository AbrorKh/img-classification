import React from 'react';
import firebase from './Firebase';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';

class UploadImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          image: null,
          raw_image_link: '',
          predicted: false,
          predicted_image_link: '',
          progress: 0
        }

      }


      handleChange = e => {
        if (e.target.files[0]) {
          const image = e.target.files[0];
          this.setState(() => ({image}));
        }
      }
      handleUpload = () => {
          const {image} = this.state;
          if(image === null){
            alert('Image is not uploaded');
            return false; 
          }
          const uploadTask = firebase.storage().ref(`images/${image.name}`).put(image);
          const ref = firebase.database().ref(`images/`);
          uploadTask.on('state_changed', 
          (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            this.setState({progress});
          }, 
          (error) => {
            alert('Image Upload was not successful');
            console.log(error);
          }, 
          () => {
            firebase.storage().ref('images').child(image.name).getDownloadURL().then(url => {
                console.log("URL FOR RAW: " + url);
                ref.push({
                    predicted: false,
                    raw_image_link: url,
                    predicted_image_link: 'PREDICTED_URL_HERE' 
                })
                alert('Image Upload was successful');
                this.setState({url});
            })
        });
      }


      render() {
        return (
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-10 col-md-10 col-lg-8 col-xl-7">
                        <div className="display-3 text-primary mt-3 mb-2">
                            Submit Images Here <br/>
                        </div>
                        <div className="display-4 text-secondary">
                        </div><br/>
                            <input type="file" name={"Select"} accept="image/*" onChange={this.handleChange.bind(this)}/><br/><br/>
                            <br/><br/>
                            <ProgressBar animated now={this.state.progress} label={`${this.state.progress}%`} min="0" max="100">
                            </ProgressBar><br/><br/>
                            <button className="btn btn-outline-primary mr-2" onClick={this.handleUpload.bind(this)}>Submit</button><br/><br/>
                            When image is uploaded, it will appear below:
                            <Image src={this.state.url} thumbnail />
                            {/* <Image src={this.state.predicted_image_link} thumbnail /> */}
                        </div>

                    </div>
                </div>
        );
    }
}
export default UploadImages;