uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

varying vec3 vColor;

    void main()
    {
        /**
        * Position
        */
        vec4 modelPosition = modelMatrix * vec4(position, 1.0); // mPosition

        // Apply Spin
        float angle = atan(modelPosition.x, modelPosition.z);
        float distanceToCenter = length(modelPosition.xz);
        float angleOffset = (uTime * 0.2) / distanceToCenter; // Arc = R * Theta => Theta = Arc / R

        angle += angleOffset;
        modelPosition.x = cos(angle) * distanceToCenter; // Arc = R * Theta
        modelPosition.z = sin(angle) * distanceToCenter; // Arc = R * Theta

        // Apply Randomness
        modelPosition.xyz += aRandomness.xyz;

        vec4 viewPosition = viewMatrix * modelPosition; // mvPosition

        vec4 projectedPosition = projectionMatrix * viewPosition; // mvpPosition

        gl_Position = projectedPosition;

        /**
        * Size
        */
        gl_PointSize = uSize * aScale;
        gl_PointSize *= (1.0 / -viewPosition.z);

        /**
        * Color
        */
        vColor = color;
    }
