import React, { Component } from 'react';
import { Shaders, Node, GLSL } from "gl-react";
import { Surface } from "gl-react-dom";

const shaders = Shaders.create({
  Saturate: {
    frag: GLSL`
      precision highp float;
      float PI = 3.14159265359;
      uniform sampler2D InputTexture;
      uniform float contrast, saturation, brightness;
      varying vec2 uv;
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
          return Rx(th.r) * Ry(th.g) * Rz(th.b) * p;
      }

      // Convert x, y pixel coordinates from an Equirectangular image into latitude/longitude coordinates.
      vec2 uvToLatLon(vec2 uv)
      {
          return vec2(uv.y * PI - PI/2.0,
                      uv.x * 2.0*PI - PI);
      }

      // Convert latitude, longitude into a 3d point on the unit-sphere.
      vec3 latLonToPoint(vec2 latLon)
      {
          vec3 point;
          point.x = cos(latLon.x) * sin(latLon.y);
          point.y = sin(latLon.x);
          point.z = cos(latLon.x) * cos(latLon.y);
          return point;
      }

      // Convert a 3D point on the unit sphere into latitude and longitude.
      vec2 pointToLatLon(vec3 point)
      {
          vec2 latLon;
          latLon.x = asin(point.y);
          latLon.y = atan(point.x, point.z);
          return latLon;
      }

      // Convert latitude, longitude to x, y pixel coordinates on an equirectangular image.
      vec2 latLonToUv(vec2 latLon)
      {
          vec2 uv;
          uv.x = (latLon.y + PI)/(2.0*PI);
          uv.y = (latLon.x + PI/2.0)/PI;
          return uv;
      }

      void main()
      {
          vec3 InputRotation = vec3(contrast, saturation, brightness);
          // vec2 uv = gl_TexCoord[0].xy;
          // Latitude and Longitude of the destination pixel (uv)
          vec2 latLon = uvToLatLon(uv);
          // Create a point on the unit-sphere from the latitude and longitude
              // X increases from left to right [-1 to 1]
              // Y increases from bottom to top [-1 to 1]
              // Z increases from back to front [-1 to 1]
          vec3 point = latLonToPoint(latLon);
          // Rotate the point based on the user input in radians
          point = rotatePoint(point, InputRotation.rgb * PI);
          // Convert back to latitude and longitude
          latLon = pointToLatLon(point);
          // Convert back to the normalized pixel coordinate
          vec2 sourcePixel = latLonToUv(latLon);
          // Set the color of the destination pixel to the color of the source pixel

          gl_FragColor = texture2D(InputTexture, sourcePixel);
      }

    `
  }
});

class MapComponent extends Component {
  render() {
    const { contrast, saturation, brightness } = this.props
    return (
      <Surface width={480} height={300}>
        <Node
          shader={shaders.Saturate}
          uniforms={{ contrast, saturation, brightness, InputTexture: 'earth_clouds.jpg' }}
        />
      </Surface>
    )
  }
}

export default MapComponent;
