import React, { Component } from 'react';
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
  Saturate: {
    frag: GLSL`
      precision highp float;
      float PI = 3.14159265359;
      vec2 SET_TO_TRANSPARENT = vec2(-1.0, -1.0);
      vec4 TRANSPARENT_PIXEL = vec4(0.0, 0.0, 0.0, 0.0);
      uniform sampler2D InputTexture;
      uniform float pitch, roll, yaw;
      varying vec2 uv;
      bool isTransparent = false;
      const int EQUI = 0;
      const int FISHEYE = 1;
      const int FLAT = 2;

      // uniform vec3 InputRotation;
      // A transformation matrix rotating about the x axis by th degrees.
      mat3 Rx(float th)
      {
          return mat3(1, 0, 0,
                      0, cos(th), -sin(th),
                      0, sin(th), cos(th));
      }
      // A transformation matrix rotating about the y axis by th degrees.
      mat3 Ry(float th)
      {
          return mat3(cos(th), 0, sin(th),
                         0,    1,    0,
                      -sin(th), 0, cos(th));
      }
      // A transformation matrix rotating about the z axis by th degrees.
      mat3 Rz(float th)
      {
          return mat3(cos(th), -sin(th), 0,
                      sin(th),  cos(th), 0,
                        0,         0   , 1);
      }

      // Rotate a point vector by th.x then th.y then th.z, and return the rotated point.
      vec3 rotatePoint(vec3 p, vec3 th)
      {
        return Rx(th.x) * Ry(th.y) * Rz(th.z) * p;
      }

      // Convert a 3D point on the unit sphere into latitude and longitude.
      vec2 pointToLatLon(vec3 point)
      {
        float r = distance(vec3(0.0, 0.0, 0.0), point);
        vec2 latLon;
        latLon.x = asin(point.z / r);
        latLon.y = atan(point.x, point.y);
        return latLon;
      }

      // Convert latitude, longitude into a 3d point on the unit-sphere.
      vec3 latLonToPoint(vec2 latLon)
      {
          float lat = latLon.x;
          float lon = latLon.y;
          vec3 point;
          point.x = cos(lat) * sin(lon);
          point.y = cos(lat) * cos(lon);
          point.z = sin(lat);
          return point;
      }

      // Convert pixel coordinates from an Equirectangular image into latitude/longitude coordinates.
      vec2 EquiUvToLatLon(vec2 uv)
      {
          return vec2(uv.y * PI - PI/2.0,
                      uv.x * 2.0*PI - PI);
      }

      // Convert  pixel coordinates from an Fisheye image into latitude/longitude coordinates.
      vec2 FisheyeUvToLatLon(vec2 uv)
      {
        vec2 pos = 2.0 * uv - 1.0;
        float r = distance(vec2(0.0, 0.0), pos);
        // Don't bother with pixels outside of the fisheye circle
        if (1.0 < r) {
          isTransparent = true;
          return SET_TO_TRANSPARENT;
        }
        vec2 latLon;
        latLon.x = (1.0 - r)*(PI / 2.0);
        // Calculate longitude
        latLon.y = PI + atan(-pos.x, pos.y);
          
        if (latLon.y < 0.0) {
          latLon.y += 2.0*PI;
        }
        vec3 point = latLonToPoint(latLon);
        point = rotatePoint(point, vec3(PI/2.0, 0.0, 0.0));
        latLon = pointToLatLon(point);
        return latLon;
      }
      
      vec2 flatImageUvToLatLon(vec2 uv)
      {
        float aspectRatio = 1.0;
        // Position of the source pixel in uv coordinates in the range [-1,1]
        vec2 pos = 2.0 * uv - 1.0;
        float fieldOfView = PI/2.0;
        vec2 imagePlaneDimensions = vec2(tan(fieldOfView / 2.0) * 2.0, (tan(fieldOfView / 2.0) * 2.0) / aspectRatio);
        
        // Position of the source pixel on the image plane
        pos *= imagePlaneDimensions;
        vec3 point = vec3(pos.x, 1.0, pos.y);
        // point = rotatePoint(point, vec3(-PI/2.0, 0.0, 0.0));
        return pointToLatLon(point);
      }


      
      // Convert latitude, longitude into a 3d point on the unit-sphere.
      vec3 flatLatLonToPoint(vec2 latLon)
      {
        vec3 point = latLonToPoint(latLon);
        // Get phi of this point, see polar coordinate system for more details.
        float phi = atan(point.x, -point.y);
        // With phi, calculate the point on the image plane that is also at the angle phi
        point.x = sin(phi) * tan(PI / 2.0 - latLon.x);
        point.y = cos(phi) * tan(PI / 2.0 - latLon.x);
        point.z = 1.0;
        return point;
      }
      // Convert latitude, longitude to x, y pixel coordinates on an equirectangular image.
      vec2 latLonToEquiUv(vec2 latLon)
      {
          vec2 uv;
          uv.x = (latLon.y + PI)/(2.0*PI);
          uv.y = (latLon.x + PI/2.0)/PI;
          return uv;
      }
      
      // Convert latitude, longitude to x, y pixel coordinates on the source fisheye image.
      vec2 pointToFisheyeUv(vec3 point)
      {	
        point = rotatePoint(point, vec3(-PI/2.0, 0.0, 0.0));
        vec2 latLon = pointToLatLon(point);
        // The distance from the source pixel to the center of the image
        float r;
        // phi is the angle of r on the unit circle. See polar coordinates for more details
        float phi;
        // Get the position of the source pixel
        vec2 sourcePixel;
        // Get the source pixel radius from center
        r = 1.0 - latLon.x/(PI / 2.0);
        // Don't bother with source pixels outside of the fisheye circle
        if (1.0 < r) {
          // Return a isTransparent pixel
          isTransparent = true;
          return SET_TO_TRANSPARENT;
        }
        phi = atan(-point.y, point.x);
        
        sourcePixel.x = r * cos(phi);
        sourcePixel.y = r * sin(phi);
        // Normalize the output pixel to be in the range [0,1]
        sourcePixel += 1.0;
        sourcePixel /= 2.0;
        return sourcePixel;
      }
      
      bool outOfFlatBounds(vec2 xy, float lower, float upper)
      {
        vec2 lowerBound = vec2(lower, lower);
        vec2 upperBound = vec2(upper, upper);
        return (any(lessThan(xy, lowerBound)) || any(greaterThan(xy, upperBound)));
      }
      vec2 latLonToFlatUv(vec2 latLon)
      {
        vec3 point = rotatePoint(latLonToPoint(latLon), vec3(-PI/2.0, 0.0, 0.0));
        latLon = pointToLatLon(point);

        vec2 xyOnImagePlane;
        vec3 p;
        if (latLon.x < 0.0) 
        {
          isTransparent = true;
          return SET_TO_TRANSPARENT;
        }
        // Derive a 3D point on the plane which correlates with the latitude and longitude in the fisheye image.
        p = flatLatLonToPoint(latLon);
        // Position of the source pixel in the source image in the range [-1,1]
        xyOnImagePlane = p.xy / 2.0 + 0.5;
        if (outOfFlatBounds(xyOnImagePlane, 0.0, 1.0)) 
    		{
          isTransparent = true;
          return SET_TO_TRANSPARENT;
        }
        return xyOnImagePlane;
      }

      void main()
      {
          int inputProjection = EQUI;
          int outputProjection = EQUI;
          vec3 InputRotation = vec3(pitch, roll, yaw);
          // Given some pixel (uv), find the latitude and longitude of that pixel
          vec2 latLon;
          if (outputProjection == EQUI)
            latLon = EquiUvToLatLon(uv);
          else if(outputProjection == FISHEYE)
            latLon = FisheyeUvToLatLon(uv);
          else if (outputProjection == FLAT)
            latLon = flatImageUvToLatLon(uv);

          // If a pixel is out of bounds, set it to be transparent
          if (isTransparent)
          {
            gl_FragColor = TRANSPARENT_PIXEL;
            return;
          }
          // Create a point on the unit-sphere from the calculated latitude and longitude
          // This sphere uses a right-handed coordinate system
            // X increases from left to right [-1 to 1]
            // Y increases from back to front [-1 to 1]
            // Z increases from bottom to top [-1 to 1]
          vec3 point = latLonToPoint(latLon);
          // Rotate the point based on the user input in radians
          point = rotatePoint(point, InputRotation.rgb * PI);
          // Convert back to latitude and longitude
          latLon = pointToLatLon(point);
          
          // Convert back to the normalized pixel coordinate
          vec2 sourcePixel;
          if (inputProjection == EQUI)
            sourcePixel = latLonToEquiUv(latLon);
          else if (inputProjection == FISHEYE)
            sourcePixel = pointToFisheyeUv(point);
          else if (inputProjection == FLAT)
            sourcePixel = latLonToFlatUv(latLon);
          if (isTransparent)
          {
            gl_FragColor = TRANSPARENT_PIXEL;
            return;
          }
          // Set the color of the destination pixel to the color of the source pixel

          gl_FragColor = texture2D(InputTexture, sourcePixel);
      }

    `
  }
});

class ProjectionComponent extends Component {
  render() {
    const { pitch, roll, yaw } = this.props
    return (
      <Surface width={1200} height={600}>
        <Node
          shader={shaders.Saturate}
          uniforms={{ pitch, roll, yaw, InputTexture: 'earth_8k.jpg' }}
        />
      </Surface>
    )
  }
}

export default ProjectionComponent;
