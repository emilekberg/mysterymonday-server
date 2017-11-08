pipeline {
  agent any
  stages {
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Build') {
      steps {
        sh 'npm run build'
      }
    }
    stage('Test') {
      steps {
        echo 'npm test'
      }
    }
    stage('Publish test result') {
      steps {
        junit(testResults: './test-results.xml', allowEmptyResults: true)
      }
    }
  }
}