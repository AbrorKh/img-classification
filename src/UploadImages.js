import React from 'react';
import firebase from './Firebase';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';
import { Container, Row, Col } from 'reactstrap';

class UploadImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          images: [],
          raw_image_link: '',
          predicted: false,
          show: false,
          predicted_image_link: '',
          raw_image_name: '',
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
            alert('Images are not chosen.');
            return false; 
          }
          const uploadTask = firebase.storage().ref(`raw_images/${image.name}`).put(image);
          const ref = firebase.database().ref(`raw_images/`);
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
            firebase.storage().ref('raw_images').child(image.name).getDownloadURL().then((url, predicted_url, data) => {
                console.log("URL FOR RAW: " + url);
                ref.push({
                    predicted: false,
                    raw_image_link: url,
                    predicted_image_link: '',
                    raw_image_name: image.name,
                })
                alert('Image Upload was successful');
                this.setState({url});
                this.setState({
                  show: !this.state.show,
                })
            })
        });
      }

      getClassifiedImage() {
        firebase.database().ref(`raw_images/`).on('value', 
        (data) => {
          // console.log(data.val())
          var classified = data.val();
          var keys = Object.keys(classified);
          // console.log(keys);
          var k = keys[keys.length-1];
          var predicted_image = classified[k].predicted_image_link;
          console.log("Predicted Image link" + predicted_image);
          this.setState({
            predicted_image_link: predicted_image
          });
        }, 
        (error) => {
          console.log(error);
        }
        )
      }
      
      refreshPage(){
        window.location.reload(false);
      }

      render() {
        return (
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-10 col-md-10 col-lg-8 col-xl-7">
                        <div className="display-3 text-primary mt-3 mb-2">
                            Bee Images <br/>
                        </div>
                        <div className="display-4 text-secondary">
                        </div><br/>
                            <input type="file" name={"Select"} accept="image/*" onChange={this.handleChange.bind(this)}/><br/><br/>
                            {/* <br/><br/> */}
                            <button className="btn btn-outline-primary mr-2" onClick={this.handleUpload.bind(this)}>Submit</button>
                            { this.state.show ? <button className="btn btn-outline-primary mr-2" onClick={this.getClassifiedImage.bind(this)}>Classify</button> : null}
                            { this.state.show ? <button className="btn btn-outline-primary mr-2" onClick={this.refreshPage.bind(this)}>Clear</button> : null }
                            <br/><br/>
                            <ProgressBar animated now={this.state.progress} label={`${this.state.progress}%`} min="0" max="100">
                            </ProgressBar><br/>             
                            Images will appear below:
                                                      
                        </div>
                        
                    </div>
                    <Container>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.url} target="#"><Image src={this.state.url} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_image} target="#"><Image src={this.state.predicted_image_link} thumbnail/></a>
                            </Col>
                        </Row>
                    </Container>  
                </div>
                
        );
    }
}
export default UploadImages;