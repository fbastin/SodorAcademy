import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ArrowRight, ArrowLeft, CheckCircle, X, Volume2, Box } from 'lucide-react';
import { speak } from '../services/speechService';

interface PrismsLessonProps {
  onCancel: () => void;
  onStartExercise?: () => void;
}

const STEPS = [
  {
    title: "Definition of a Prism",
    content: "A prism is a polyhedron comprising an n-sided polygon base, a translated copy (the second base), and n lateral faces joining corresponding sides of both bases.",
    image: "/SodorAcademy/media/prism_tunnel_v4_1780970828472.png",
    highlight: "Prism"
  },
  {
    title: "Rectangular Prism",
    content: "A rectangular prism is a polyhedron with 6 rectangular faces. Opposite faces are parallel and congruent. Hidden edges are depicted as dashed lines.",
    image: "/SodorAcademy/media/math_rect_prism_1780968225402.png",
    stats: { faces: 6, edges: 12, vertices: 8 }
  },
  {
    title: "Prism Classification",
    content: "Prisms are classified by the geometry of their polygonal bases. A triangular base defines a triangular prism, while a rectangular base defines a rectangular prism.",
    image: "/SodorAcademy/media/prism_bases_1780967956188.png",
    highlight: "Bases"
  },
  {
    title: "Triangular Prism",
    content: "A triangular prism is a polyhedron composed of 2 parallel triangular bases and 3 rectangular lateral faces connecting corresponding edges.",
    image: "/SodorAcademy/media/math_tri_prism_v2_1780968918773.png",
    stats: { faces: 5, edges: 9, vertices: 6 }
  },
  {
    title: "Definition of a Pyramid",
    content: "A pyramid is a polyhedron formed by connecting a polygonal base to a point, called the apex. The lateral faces are triangles that intersect at the apex.",
    image: "/SodorAcademy/media/math_sq_pyramid_1780968244301.png",
    highlight: "Apex"
  },
  {
    title: "Square Pyramid",
    content: "A square pyramid features a square base and 4 triangular lateral faces that slope upward to meet at the apex.",
    image: "/SodorAcademy/media/math_sq_pyramid_1780968244301.png",
    stats: { faces: 5, edges: 8, vertices: 5 }
  },
  {
    title: "Triangular Pyramid",
    content: "A triangular pyramid, or tetrahedron, is a polyhedron composed of a triangular base and 3 triangular lateral faces, resulting in 4 triangular faces in total.",
    image: "/SodorAcademy/media/math_tri_pyramid_1780968253312.png",
    stats: { faces: 4, edges: 6, vertices: 4 }
  },
  {
    title: "Pentagonal Pyramid",
    content: "A pentagonal pyramid is a polyhedron comprising a pentagon base and 5 triangular lateral faces that intersect at the apex.",
    image: "/SodorAcademy/media/math_pentagonal_pyramid_1780969256129.png",
    stats: { faces: 6, edges: 10, vertices: 6 }
  },
  {
    title: "Hexagonal Pyramid",
    content: "A hexagonal pyramid is a polyhedron comprising a hexagon base and 6 triangular lateral faces that intersect at the apex.",
    image: "/SodorAcademy/media/math_hexagonal_pyramid_1780969264106.png",
    stats: { faces: 7, edges: 12, vertices: 7 }
  },
  {
    title: "Right vs. Oblique Pyramids",
    content: "In a right pyramid, the apex is positioned directly above the centroid of the base. In an oblique pyramid, the apex is off-center relative to the base.",
    image: "/SodorAcademy/media/math_pentagonal_pyramid_1780969256129.png",
    highlight: "Alignment"
  },
  {
    title: "Geometric Properties",
    content: "Polyhedra are characterized by their faces (surfaces), edges (line segments where faces meet), and vertices (intersection points of edges).",
    image: "/SodorAcademy/media/prism_faces_1780967988239.png",
    highlight: "Faces, Edges, Vertices"
  },
  {
    title: "Property Verification",
    content: "Verify the properties of a rectangular prism: it is composed of 6 faces, 12 edges, and 8 vertices.",
    image: "/SodorAcademy/media/cargo_crate_1780967967201.png",
    stats: { faces: 6, edges: 12, vertices: 8 }
  }
];

export default function PrismsLesson({ onCancel, onStartExercise }: PrismsLessonProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const next = useCallback(() => {
    setCurrentStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
  }, []);

  const prev = useCallback(() => {
    setCurrentStep(prevStep => (prevStep > 0 ? prevStep - 1 : prevStep));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  const step = STEPS[currentStep];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 overflow-hidden flex flex-col min-h-[650px]">
        {/* Header */}
        <div className="bg-blue-600 p-8 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Box size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tight">Academy Lesson</h2>
              <p className="text-blue-100 text-sm font-bold">Topic: Discovering Prisms</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-3 hover:bg-white/10 rounded-full transition-colors active:scale-95"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-100 w-full flex">
          {STEPS.map((_, idx) => (
            <div 
              key={idx} 
              className={`flex-1 transition-all duration-500 ${idx <= currentStep ? 'bg-blue-500' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full flex flex-col"
            >
              <div className="flex items-center gap-6 mb-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-widest block">Step {currentStep + 1} of {STEPS.length}</span>
                    <button 
                      onClick={() => speak(step.title + ". " + step.content)}
                      className="p-2 bg-slate-100 hover:bg-blue-100 text-slate-400 hover:text-blue-600 rounded-full transition-colors"
                      title="Listen to lesson"
                    >
                      <Volume2 size={18} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black text-slate-900">{step.title}</h3>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <p className="text-xl leading-relaxed text-slate-700 font-medium mb-6">
                  {step.content}
                </p>

                {/* Main Illustration */}
                <div className="mb-6 w-full h-[320px] bg-slate-50 rounded-[32px] overflow-hidden shadow-xl border-[6px] border-white relative group flex items-center justify-center">
                  <div className="absolute inset-0 bg-blue-500/5 mix-blend-multiply pointer-events-none z-10" />
                  <img src={step.image} alt={step.title} className="w-full h-full object-contain object-center group-hover:scale-105 transition-transform duration-700 p-2" />
                </div>

                {/* Example Visualization */}
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-center justify-center min-h-[120px] mt-auto">
                  {step.highlight && (
                    <div className="text-4xl font-black text-blue-600 tracking-widest uppercase">
                      {step.highlight}
                    </div>
                  )}

                  {step.stats && (
                    <div className="flex items-center gap-8 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-blue-600 mb-2">{step.stats.faces}</span>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Faces</span>
                      </div>
                      <div className="w-px h-16 bg-slate-200" />
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-blue-600 mb-2">{step.stats.edges}</span>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Edges</span>
                      </div>
                      <div className="w-px h-16 bg-slate-200" />
                      <div className="flex flex-col items-center">
                        <span className="text-4xl font-black text-blue-600 mb-2">{step.stats.vertices}</span>
                        <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Vertices</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation */}
              <div className="mt-12 flex justify-between items-center">
                <button
                  onClick={prev}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 font-black uppercase tracking-widest text-sm transition-all ${currentStep === 0 ? 'opacity-0' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ArrowLeft size={18} /> Previous
                </button>

                {currentStep < STEPS.length - 1 ? (
                  <button
                    onClick={next}
                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
                  >
                    Next Step <ArrowRight size={20} />
                  </button>
                ) : (
                  <button
                    onClick={onStartExercise || onCancel}
                    className="bg-emerald-600 text-white px-10 py-5 rounded-2xl font-black flex items-center gap-3 shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all hover:scale-105 active:scale-95 text-lg"
                  >
                    Finish Lesson <CheckCircle size={24} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      <button 
        onClick={onCancel}
        className="mt-12 mx-auto block text-slate-400 font-bold hover:text-slate-600 transition-colors uppercase tracking-widest text-xs"
      >
        Return to Station
      </button>
    </div>
  );
}
