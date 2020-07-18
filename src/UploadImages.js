import React from 'react';
import firebase from './Firebase';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Image from 'react-bootstrap/Image';
import { Container, Row, Col } from 'reactstrap';
import mySvg from './bee(1).svg'
import { TiCloudStorageOutline } from 'react-icons/ti';
class UploadImages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          images: [],
          predicted_images: [],
          raw_images: [],
          raw_image_link: '',
          predicted: false,
          show: false,
          show1: false, 
          predicted_image_link: '',
          raw_image_name: '',
          progress: 0
        }

      }


      handleChange = e => {
        let imagesList = []
        for(let i = 0; i < e.target.files.length; i++){
          if (e.target.files[i]) {
            imagesList.push(e.target.files[i]);
            this.setState(() => ({images: imagesList}));
          }
        }
        // console.log(imagesList[0], imagesList[1]);
        
      }

      handleUpload = () => {
          const {images} = this.state;
          if(images.length === 0){
            alert('Images are not chosen.');
            return false; 
          }
          for(let i = 0; i < images.length; i++){
            const uploadTask = firebase.storage().ref(`raw_images/${images[i].name}`).put(images[i]);
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
              firebase.storage().ref('raw_images').child(images[i].name).getDownloadURL().then((url) => {
              // console.log("URL FOR RAW: " + url);
              ref.push({
                predicted: false,
                raw_image_link: url,
                predicted_image_link: '',
                raw_image_name: images[i].name,
              });
              });

            });
          }
          this.setState({
            show: !this.state.show,
            show1: !this.state.show1
          });
          alert(`${images.length} images will be uploaded. `);
        }//end upload handler function 
      
    

      getClassifiedImage() {
        const {images} = this.state;
          
        firebase.database().ref(`raw_images/`).on('value', 
        (data) => {
          // console.log(data.val())
          var classified = data.val();
          var keys = Object.keys(classified);
          // console.log(keys);
          let predicted_ones = [];
          let raw_ones = [];
          for(let i = keys.length-1; i > (keys.length - 1 - images.length); i--){
            var k = keys[i];
            var raw_image = classified[k].raw_image_link;
            var predicted_image = classified[k].predicted_image_link;
            // console.log(predicted_image);
            if(predicted_image !== null){
              predicted_ones.push(predicted_image);
            }
            if(raw_image !== null){
              raw_ones.push(raw_image);
            }
          }
          console.log(predicted_ones);
          console.log(raw_ones);
          // for(let i = 0; i < predicted_ones.length; i++){
          //   console.log(predicted_ones[i]);
          // }
          this.setState({
            raw_images: raw_ones,
            predicted_images: predicted_ones
          })
          
        }, 
        (error) => {
          console.log(error);
        }
        )
      }
      
      refreshPage(){
        window.location.reload(false);
      }

      triggerInputFile(){
        this.fileInput.click();
        this.setState({
          show1: true,
        })
      }
  render() {
        //const { raw_images, predicted_images } = this.state;
      
        return (
            <div className="container text-center">
                <div className="row justify-content-center">
                    <div className="col-10 col-md-10 col-lg-8 col-xl-7">
                        <div className="display-4 text-primary mt-3 mb-2">
                            <img src={mySvg} width="100" height="100" alt="bee-logo"/><br/>
                            Upload Bee Images Here<br/>

                        </div>
                        <div className="display-4 text-secondary">
                        </div><br/>
                            <button className="btn btn-outline-info mr-2" onClick={this.triggerInputFile.bind(this)}><TiCloudStorageOutline size={30} /> <h5>Choose images to upload</h5></button><br/>
                            <p className="text-secondary">{this.state.images.length} images are chosen.</p> { this.state.show1 ? <p>Please select Upload to upload the images.</p> : null }
                            <input type="file" ref={fileInput => this.fileInput = fileInput} multiple accept="image/*" onChange={this.handleChange.bind(this)} style={{display:'none'}}/>
                            { this.state.show ? <h6 className="text-secondary">Press on Classify to classify images or Clear to start over:</h6> : null}
                            {!this.state.show ? <button className="btn btn-outline-primary mr-2" onClick={this.handleUpload.bind(this)}>Upload</button> : null }
                            { this.state.show ? <button className="btn btn-outline-info mr-2" onClick={this.getClassifiedImage.bind(this)}>Classify</button> : null}
                            { this.state.show ? <button className="btn btn-outline-warning mr-2" onClick={this.refreshPage.bind(this)}>Clear</button> : null }
                            <br/><br/>
                            <ProgressBar animated now={this.state.progress} label={`${this.state.progress}%`} min="0" max="100">
                            </ProgressBar><br/>              
                            <h3 className="text-secondary">Images will appear below:</h3>
                            <br/>                                                
                        </div>
                    </div>
                    <Container>
                        <Row>
                            <Col xs="6" md={6}>{ this.state.show ? <h4 className="text-secondary">Uploaded images:</h4> : null }
                                <a href={this.state.raw_images[0]} target="#"><Image src={this.state.raw_images[0]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>{ this.state.show ? <h4 className="text-secondary">Classified images:</h4> : null }
                                <a href={this.state.predicted_images[0]} target="#"><Image src={this.state.predicted_images[0]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[1]} target="#"><Image src={this.state.raw_images[1]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[1]} target="#"><Image src={this.state.predicted_images[1]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[2]} target="#"><Image src={this.state.raw_images[2]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[2]} target="#"><Image src={this.state.predicted_images[2]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[3]} target="#"><Image src={this.state.raw_images[3]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[3]} target="#"><Image src={this.state.predicted_images[3]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[4]} target="#"><Image src={this.state.raw_images[4]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[4]} target="#"><Image src={this.state.predicted_images[4]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[5]} target="#"><Image src={this.state.raw_images[5]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[5]} target="#"><Image src={this.state.predicted_images[5]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[6]} target="#"><Image src={this.state.raw_images[6]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[6]} target="#"><Image src={this.state.predicted_images[6]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[7]} target="#"><Image src={this.state.raw_images[7]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[7]} target="#"><Image src={this.state.predicted_images[7]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[8]} target="#"><Image src={this.state.raw_images[8]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[8]} target="#"><Image src={this.state.predicted_images[8]} thumbnail/></a>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs="6" md={6}>
                                <a href={this.state.raw_images[9]} target="#"><Image src={this.state.raw_images[9]} thumbnail/></a>
                            </Col>            
                            <Col xs="6" md={6}>
                                <a href={this.state.predicted_images[9]} target="#"><Image src={this.state.predicted_images[9]} thumbnail/></a>
                            </Col>
                        </Row>

                    </Container>  
                </div>
                
        );
}
      }
      
export default UploadImages;